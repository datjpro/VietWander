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
const auth = getAuth(app);
const db = getFirestore(app);

const elements = {
  authStatus: document.querySelector('#auth-status'),
  currentUser: document.querySelector('#current-user'),
  authForm: document.querySelector('#auth-form'),
  displayName: document.querySelector('#display-name'),
  email: document.querySelector('#email'),
  password: document.querySelector('#password'),
  loginButton: document.querySelector('#login-button'),
  registerButton: document.querySelector('#register-button'),
  logoutButton: document.querySelector('#logout-button'),
  authMessage: document.querySelector('#auth-message'),
  demoCheckinButton: document.querySelector('#demo-checkin-button'),
  demoMessage: document.querySelector('#demo-message'),
  statProvinces: document.querySelector('#stat-provinces'),
  statCheckins: document.querySelector('#stat-checkins'),
  statLevel: document.querySelector('#stat-level'),
  feedList: document.querySelector('#feed-list'),
  leaderboardList: document.querySelector('#leaderboard-list'),
  collectionList: document.querySelector('#collection-list'),
};

const fallbackImage = 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80';
const fallbackCollectionImage = 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80';
const state = {
  user: null,
  profile: null,
  posts: [],
  leaderboard: [],
  collection: [],
};

let unsubscribePosts = null;
let unsubscribeLeaderboard = null;
let unsubscribeProfile = null;
let unsubscribeCollection = null;

function setMessage(element, message, type = '') {
  element.textContent = message || '';
  element.className = `helper${type ? ` ${type}` : ''}`;
}

function getLevelTitle(visitedProvinceCount) {
  if (visitedProvinceCount >= 45) return 'Huyền thoại xuyên Việt';
  if (visitedProvinceCount >= 20) return 'Nhà thám hiểm';
  if (visitedProvinceCount >= 8) return 'Người săn hành trình';
  return 'Du khách';
}

function formatCompactNumber(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace('.0', '')}k`;
  }

  return String(value ?? 0);
}

function formatDate(value) {
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

function renderStats() {
  const profile = state.profile || {
    visitedProvinceCount: 0,
    verifiedCheckinCount: 0,
    levelTitle: 'Du khách',
  };

  elements.statProvinces.textContent = String(profile.visitedProvinceCount || 0);
  elements.statCheckins.textContent = String(profile.verifiedCheckinCount || 0);
  elements.statLevel.textContent = profile.levelTitle || 'Du khách';
}

function renderFeed() {
  if (!state.posts.length) {
    elements.feedList.innerHTML = '<p class="muted">Chưa có bài đăng nào trong `posts`.</p>';
    return;
  }

  elements.feedList.innerHTML = state.posts
    .map(
      (post) => `
        <article class="feed-card">
          <p class="eyebrow">${post.hashtag || '#VietWanderCheckin'}</p>
          <h3>${post.authorName || 'VietWander Explorer'}</h3>
          <div class="feed-meta">
            <span>${post.landmarkName || 'Điểm check-in'}, ${post.provinceName || 'Việt Nam'}</span>
            <span>${formatCompactNumber(post.likeCount || 0)} ❤️ · ${formatCompactNumber(post.commentCount || 0)} 💬</span>
          </div>
          <img src="${post.imageUrl || fallbackImage}" alt="${post.landmarkName || 'check-in'}" />
          <p class="muted" style="margin-top: 12px;">${post.caption || 'Bài viết chưa có caption.'}</p>
        </article>
      `
    )
    .join('');
}

function renderLeaderboard() {
  if (!state.leaderboard.length) {
    elements.leaderboardList.innerHTML = '<p class="muted">Chưa có dữ liệu `users` để xếp hạng.</p>';
    return;
  }

  elements.leaderboardList.innerHTML = state.leaderboard
    .map(
      (entry, index) => `
        <article class="rank-card">
          <div style="display:flex; gap:14px; align-items:center;">
            <div class="rank-badge">${index + 1}</div>
            <div>
              <h3>${entry.displayName || 'Du khách mới'}</h3>
              <p class="muted">${entry.levelTitle || getLevelTitle(entry.visitedProvinceCount || 0)}</p>
            </div>
          </div>
          <strong>${entry.visitedProvinceCount || 0}/63</strong>
        </article>
      `
    )
    .join('');
}

function renderCollection() {
  if (!state.user) {
    elements.collectionList.innerHTML = '<p class="muted">Đăng nhập để xem check-in cá nhân.</p>';
    return;
  }

  if (!state.collection.length) {
    elements.collectionList.innerHTML = '<p class="muted">Bạn chưa có check-in nào. Hãy tạo một check-in demo.</p>';
    return;
  }

  const grouped = new Map();

  [...state.collection]
    .sort((left, right) => {
      const leftTime = left.createdAt?.toDate ? left.createdAt.toDate().getTime() : 0;
      const rightTime = right.createdAt?.toDate ? right.createdAt.toDate().getTime() : 0;
      return rightTime - leftTime;
    })
    .forEach((item) => {
      if (!grouped.has(item.provinceId)) {
        grouped.set(item.provinceId, item);
      }
    });

  elements.collectionList.innerHTML = [...grouped.values()]
    .map(
      (item) => `
        <article class="collection-card">
          <p class="eyebrow">${item.provinceId || 'province'}</p>
          <h3>${item.provinceName || 'Địa danh mới'}</h3>
          <p class="muted">Check-in gần nhất: ${formatDate(item.createdAt)}</p>
          <img src="${item.imageUrl || fallbackCollectionImage}" alt="${item.provinceName || 'check-in'}" />
        </article>
      `
    )
    .join('');
}

function renderAll() {
  renderStats();
  renderFeed();
  renderLeaderboard();
  renderCollection();
}

function subscribePublicCollections() {
  unsubscribePosts?.();
  unsubscribeLeaderboard?.();

  unsubscribePosts = onSnapshot(
    query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(8)),
    (snapshot) => {
      state.posts = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      renderFeed();
    },
    () => {
      elements.feedList.innerHTML = '<p class="muted">Không đọc được collection `posts`. Kiểm tra Firestore rules/index.</p>';
    }
  );

  unsubscribeLeaderboard = onSnapshot(
    query(collection(db, 'users'), orderBy('visitedProvinceCount', 'desc'), limit(10)),
    (snapshot) => {
      state.leaderboard = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      renderLeaderboard();
    },
    () => {
      elements.leaderboardList.innerHTML = '<p class="muted">Không đọc được collection `users`. Kiểm tra Firestore rules.</p>';
    }
  );
}

function clearUserSubscriptions() {
  unsubscribeProfile?.();
  unsubscribeCollection?.();
  unsubscribeProfile = null;
  unsubscribeCollection = null;
}

function subscribeUserCollections(uid) {
  clearUserSubscriptions();

  unsubscribeProfile = onSnapshot(
    doc(db, 'users', uid),
    (snapshot) => {
      const data = snapshot.exists() ? snapshot.data() : null;
      state.profile = data
        ? {
            ...data,
            levelTitle: data.levelTitle || getLevelTitle(data.visitedProvinceCount || 0),
          }
        : null;
      renderStats();
    },
    () => {
      state.profile = null;
      renderStats();
    }
  );

  unsubscribeCollection = onSnapshot(
    query(collection(db, 'checkins'), where('userId', '==', uid), orderBy('createdAt', 'desc'), limit(20)),
    (snapshot) => {
      state.collection = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      renderCollection();
    },
    () => {
      elements.collectionList.innerHTML = '<p class="muted">Không đọc được collection `checkins`. Hãy deploy composite index.</p>';
    }
  );
}

async function ensureUserProfile(user, displayNameOverride = '') {
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

async function createDemoCheckin() {
  if (!state.user) {
    throw new Error('Bạn cần đăng nhập trước khi tạo check-in demo.');
  }

  const profile = (await ensureUserProfile(state.user)) || {};
  const snapshot = await getDocs(query(collection(db, 'checkins'), where('userId', '==', state.user.uid)));
  const hasVisitedDanang = snapshot.docs.some((item) => item.data().provinceId === 'danang');
  const nextVisitedProvinceCount = (profile.visitedProvinceCount || 0) + (hasVisitedDanang ? 0 : 1);
  const nextVerifiedCheckinCount = (profile.verifiedCheckinCount || 0) + 1;
  const nextLevelTitle = getLevelTitle(nextVisitedProvinceCount);

  const checkinPayload = {
    userId: state.user.uid,
    authorName: state.user.displayName || profile.displayName || 'Du khách mới',
    provinceId: 'danang',
    provinceName: 'Đà Nẵng',
    landmarkId: 'dragon-bridge',
    landmarkName: 'Cầu Rồng',
    hashtag: '#DaNangCheckin',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, 'checkins'), checkinPayload);
  await addDoc(collection(db, 'posts'), {
    ...checkinPayload,
    caption: 'Check-in demo từ web dashboard VietWander.',
    likeCount: 0,
    commentCount: 0,
  });

  await setDoc(
    doc(db, 'users', state.user.uid),
    {
      uid: state.user.uid,
      displayName: state.user.displayName || profile.displayName || 'Du khách mới',
      email: state.user.email || null,
      photoURL: state.user.photoURL || null,
      visitedProvinceCount: nextVisitedProvinceCount,
      verifiedCheckinCount: nextVerifiedCheckinCount,
      levelTitle: nextLevelTitle,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

async function handleLogin(event) {
  event.preventDefault();
  const email = elements.email.value.trim();
  const password = elements.password.value;

  try {
    setMessage(elements.authMessage, 'Đang đăng nhập...', 'success');
    await signInWithEmailAndPassword(auth, email, password);
    setMessage(elements.authMessage, 'Đăng nhập thành công.', 'success');
  } catch (error) {
    setMessage(elements.authMessage, error.message, 'error');
  }
}

async function handleRegister() {
  const displayName = elements.displayName.value.trim();
  const email = elements.email.value.trim();
  const password = elements.password.value;

  try {
    setMessage(elements.authMessage, 'Đang tạo tài khoản...', 'success');
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }

    await ensureUserProfile(credential.user, displayName);
    setMessage(elements.authMessage, 'Tạo tài khoản thành công.', 'success');
  } catch (error) {
    setMessage(elements.authMessage, error.message, 'error');
  }
}

async function handleLogout() {
  try {
    await signOut(auth);
    setMessage(elements.authMessage, 'Bạn đã đăng xuất.', 'success');
  } catch (error) {
    setMessage(elements.authMessage, error.message, 'error');
  }
}

elements.authForm.addEventListener('submit', handleLogin);
elements.registerButton.addEventListener('click', handleRegister);
elements.logoutButton.addEventListener('click', handleLogout);
elements.demoCheckinButton.addEventListener('click', async () => {
  try {
    setMessage(elements.demoMessage, 'Đang tạo check-in demo...', 'success');
    await createDemoCheckin();
    setMessage(elements.demoMessage, 'Đã tạo check-in demo vào Firestore.', 'success');
  } catch (error) {
    setMessage(elements.demoMessage, error.message, 'error');
  }
});

onAuthStateChanged(auth, async (user) => {
  state.user = user;
  elements.authStatus.textContent = user ? 'Đã đăng nhập' : 'Chưa đăng nhập';
  elements.currentUser.textContent = user?.email || 'Chưa đăng nhập';

  if (user) {
    await ensureUserProfile(user);
    subscribeUserCollections(user.uid);
  } else {
    state.profile = null;
    state.collection = [];
    clearUserSubscriptions();
  }

  renderAll();
});

subscribePublicCollections();
renderAll();
