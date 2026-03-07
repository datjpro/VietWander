import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js';

const firebaseConfig = {
  apiKey: 'AIzaSyCevIsxM9c-dU5kswzg6AiXY5sFVzxtAOQ',
  authDomain: 'vietwander-fdf99.firebaseapp.com',
  projectId: 'vietwander-fdf99',
  storageBucket: 'vietwander-fdf99.firebasestorage.app',
  messagingSenderId: '121533003805',
  appId: '1:121533003805:web:bafe967b94f4a4fe10eef4',
  measurementId: 'G-290RLYJ2E4',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const fallbackImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
export const fallbackCollectionImage = 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80';

export function getLevelTitle(visitedProvinceCount) {
  if (visitedProvinceCount >= 45) return 'Huyền thoại xuyên Việt';
  if (visitedProvinceCount >= 20) return 'Nhà thám hiểm';
  if (visitedProvinceCount >= 8) return 'Người săn hành trình';
  return 'Du khách';
}

export function formatCompactNumber(value) {
  if ((value ?? 0) >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace('.0', '')}k`;
  }

  return String(value ?? 0);
}

export function formatDate(value) {
  const date = value?.toDate ? value.toDate() : value instanceof Date ? value : null;

  if (!date) {
    return 'Mới check-in';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export async function ensureUserProfile(user, displayNameOverride = '') {
  const profileRef = doc(db, 'users', user.uid);
  const existing = await getDoc(profileRef);

  if (existing.exists()) {
    return existing.data();
  }

  const displayName = displayNameOverride || user.displayName || user.email?.split('@')[0] || 'Du khách mới';
  const payload = {
    uid: user.uid,
    displayName,
    email: user.email || null,
    photoURL: user.photoURL || null,
    level: 1,
    levelTitle: 'Du khách',
    visitedProvinceCount: 0,
    verifiedCheckinCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  await setDoc(profileRef, payload, { merge: true });
  return payload;
}

export async function registerWithEmail({ displayName, email, password }) {
  const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);

  if (displayName.trim()) {
    await updateProfile(credential.user, { displayName: displayName.trim() });
  }

  await ensureUserProfile(credential.user, displayName.trim());
  return credential.user;
}

export async function loginWithEmail({ email, password }) {
  const credential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return credential.user;
}

export async function logoutCurrentUser() {
  await signOut(auth);
}

export function observeAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function subscribePosts(callback, onError) {
  return onSnapshot(
    query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(8)),
    (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError
  );
}

export function subscribeLeaderboard(callback, onError) {
  return onSnapshot(
    query(collection(db, 'users'), orderBy('visitedProvinceCount', 'desc'), limit(10)),
    (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError
  );
}

export function subscribeProfile(uid, callback, onError) {
  return onSnapshot(doc(db, 'users', uid), (snapshot) => callback(snapshot.exists() ? snapshot.data() : null), onError);
}

export function subscribeCollection(uid, callback, onError) {
  return onSnapshot(
    query(collection(db, 'checkins'), where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(20)),
    (snapshot) => callback(snapshot.docs.map((item) => ({ id: item.id, ...item.data() }))),
    onError
  );
}

export async function createDemoCheckin(user) {
  const profile = (await ensureUserProfile(user)) || {};
  const snapshot = await getDocs(query(collection(db, 'checkins'), where('userId', '==', user.uid)));
  const hasVisitedDanang = snapshot.docs.some((item) => item.data().provinceId === 'danang');
  const nextVisitedProvinceCount = (profile.visitedProvinceCount || 0) + (hasVisitedDanang ? 0 : 1);
  const nextVerifiedCheckinCount = (profile.verifiedCheckinCount || 0) + 1;
  const nextLevelTitle = getLevelTitle(nextVisitedProvinceCount);

  const checkinPayload = {
    userId: user.uid,
    authorName: user.displayName || profile.displayName || 'Du khách mới',
    provinceId: 'danang',
    provinceName: 'Đà Nẵng',
    landmarkId: 'dragon-bridge',
    landmarkName: 'Cầu Rồng',
    hashtag: '#DaNangCheckin',
    imageUrl: fallbackImage,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'checkins'), checkinPayload);
  await addDoc(collection(db, 'posts'), {
    ...checkinPayload,
    caption: 'Check-in demo từ web React của VietWander.',
    likeCount: 0,
    commentCount: 0,
  });

  await setDoc(
    doc(db, 'users', user.uid),
    {
      uid: user.uid,
      displayName: user.displayName || profile.displayName || 'Du khách mới',
      email: user.email || null,
      photoURL: user.photoURL || null,
      visitedProvinceCount: nextVisitedProvinceCount,
      verifiedCheckinCount: nextVerifiedCheckinCount,
      levelTitle: nextLevelTitle,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}
