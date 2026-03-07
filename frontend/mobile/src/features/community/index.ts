import type { User } from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { useEffect, useMemo, useState } from 'react';
import {
  collectionItems,
  designAssets,
  feedPosts,
  leaderboardEntries as fallbackLeaderboardEntries,
  leaderboardPodium as fallbackLeaderboardPodium,
  type FeedPost,
  type LeaderboardEntry,
} from '../../data/mock';
import { db } from '../../lib/firebase';

export type UserProfile = {
  uid: string;
  displayName: string;
  email: string | null;
  photoURL: string | null;
  level: number;
  levelTitle: string;
  visitedProvinceCount: number;
  verifiedCheckinCount: number;
};

export type UserCollectionItem = {
  id: string;
  provinceId: string;
  name: string;
  dateLabel: string;
  imageUrl?: string;
  checkinCount: number;
};

type FirestoreUserProfile = Partial<UserProfile> & {
  displayName?: string;
  email?: string | null;
  photoURL?: string | null;
  createdAt?: { toDate?: () => Date } | Date | null;
  updatedAt?: { toDate?: () => Date } | Date | null;
};

type FirestorePost = {
  authorName?: string;
  caption?: string;
  commentCount?: number;
  hashtag?: string;
  imageUrl?: string;
  landmarkName?: string;
  likeCount?: number;
  provinceName?: string;
};

type FirestoreCheckin = {
  createdAt?: { toDate?: () => Date } | Date | null;
  imageUrl?: string;
  provinceId?: string;
  provinceName?: string;
};

type AsyncState<T> = {
  data: T;
  loading: boolean;
  error: string | null;
};

export const fallbackLeaderboardData: LeaderboardEntry[] = [
  { ...fallbackLeaderboardPodium[1], title: 'Nhà vô địch xuyên Việt' },
  { ...fallbackLeaderboardPodium[0], title: 'Top check-in bền bỉ' },
  { ...fallbackLeaderboardPodium[2], title: 'Săn địa danh siêu tốc' },
  ...fallbackLeaderboardEntries,
];

function formatCompactNumber(value: number) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(value >= 10000 ? 0 : 1).replace('.0', '')}k`;
  }

  return String(value);
}

function formatDateLabel(value?: { toDate?: () => Date } | Date | null) {
  if (!value) {
    return 'Mới check-in';
  }

  const date = value instanceof Date ? value : value.toDate?.();

  if (!date) {
    return 'Mới check-in';
  }

  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

export function getLevelTitle(visitedProvinceCount: number) {
  if (visitedProvinceCount >= 45) {
    return 'Huyền thoại xuyên Việt';
  }

  if (visitedProvinceCount >= 20) {
    return 'Nhà thám hiểm';
  }

  if (visitedProvinceCount >= 8) {
    return 'Người săn hành trình';
  }

  return 'Du khách';
}

function getAvatarByRank(rank: number, isCurrentUser = false) {
  if (isCurrentUser) {
    return designAssets.currentUserRank;
  }

  switch (rank) {
    case 1:
      return designAssets.rankGold;
    case 2:
      return designAssets.rankSilver;
    case 3:
      return designAssets.rankBronze;
    case 4:
      return designAssets.rank4;
    case 5:
      return designAssets.rank5;
    case 6:
      return designAssets.rank6;
    default:
      return designAssets.rank7;
  }
}

function mapUserProfile(uid: string, input?: FirestoreUserProfile | null): UserProfile {
  const visitedProvinceCount = input?.visitedProvinceCount ?? 0;

  return {
    uid,
    displayName: input?.displayName || 'Du khách mới',
    email: input?.email ?? null,
    photoURL: input?.photoURL ?? null,
    level: input?.level ?? 1,
    levelTitle: input?.levelTitle || getLevelTitle(visitedProvinceCount),
    visitedProvinceCount,
    verifiedCheckinCount: input?.verifiedCheckinCount ?? 0,
  };
}

function mapFeedPost(id: string, input: FirestorePost): FeedPost {
  const provinceName = input.provinceName || 'Việt Nam';
  const landmarkName = input.landmarkName || 'Điểm check-in nổi bật';

  return {
    id,
    author: input.authorName || 'VietWander Explorer',
    location: `${landmarkName}, ${provinceName}`,
    imageUrl: input.imageUrl || designAssets.phuQuocSunset,
    likesLabel: formatCompactNumber(input.likeCount ?? 0),
    commentsLabel: formatCompactNumber(input.commentCount ?? 0),
    caption: input.caption || 'Vừa lưu một check-in mới cùng VietWander.',
    hashtag: input.hashtag || '#VietWanderCheckin',
  };
}

function mapLeaderboardEntry(rank: number, uid: string, input: FirestoreUserProfile, currentUserId?: string): LeaderboardEntry {
  const visitedProvinceCount = input.visitedProvinceCount ?? 0;

  return {
    id: uid,
    rank,
    name: input.displayName || 'Du khách mới',
    title: input.levelTitle || getLevelTitle(visitedProvinceCount),
    provinceCountLabel: `${visitedProvinceCount}/63`,
    avatarUrl: input.photoURL || getAvatarByRank(rank, uid === currentUserId),
  };
}

function mapCollectionItems(checkins: Array<{ id: string; data: FirestoreCheckin }>): UserCollectionItem[] {
  const grouped = new Map<string, UserCollectionItem>();

  const sortedCheckins = [...checkins].sort((left, right) => {
    const leftDate = left.data.createdAt instanceof Date ? left.data.createdAt : left.data.createdAt?.toDate?.();
    const rightDate = right.data.createdAt instanceof Date ? right.data.createdAt : right.data.createdAt?.toDate?.();

    return (rightDate?.getTime() || 0) - (leftDate?.getTime() || 0);
  });

  for (const item of sortedCheckins) {
    const provinceId = item.data.provinceId || item.id;
    const existing = grouped.get(provinceId);

    if (!existing) {
      grouped.set(provinceId, {
        id: provinceId,
        provinceId,
        name: item.data.provinceName || 'Địa danh mới',
        dateLabel: formatDateLabel(item.data.createdAt),
        imageUrl: item.data.imageUrl || designAssets.daNangThumb,
        checkinCount: 1,
      });
      continue;
    }

    existing.checkinCount += 1;
  }

  return [...grouped.values()];
}

export function useUserProfile(uid?: string) {
  const [state, setState] = useState<AsyncState<UserProfile | null>>({
    data: null,
    loading: Boolean(uid),
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    const unsubscribe = onSnapshot(
      doc(db, 'users', uid),
      (snapshot) => {
        setState({
          data: mapUserProfile(uid, snapshot.exists() ? (snapshot.data() as FirestoreUserProfile) : null),
          loading: false,
          error: null,
        });
      },
      () => {
        setState({ data: null, loading: false, error: 'Không tải được hồ sơ người dùng.' });
      }
    );

    return unsubscribe;
  }, [uid]);

  return state;
}

export function useProvinceFeed() {
  const [state, setState] = useState<AsyncState<FeedPost[]>>({
    data: feedPosts,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const feedQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(12));

    const unsubscribe = onSnapshot(
      feedQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setState({ data: feedPosts, loading: false, error: null });
          return;
        }

        setState({
          data: snapshot.docs.map((item) => mapFeedPost(item.id, item.data() as FirestorePost)),
          loading: false,
          error: null,
        });
      },
      () => {
        setState({ data: feedPosts, loading: false, error: 'Không tải được feed thời gian thực.' });
      }
    );

    return unsubscribe;
  }, []);

  const hashtags = useMemo(() => state.data.slice(0, 3).map((item) => item.hashtag), [state.data]);

  return {
    ...state,
    hashtags: hashtags.length ? hashtags : ['#VietWanderCheckin'],
  };
}

export function useLeaderboard(currentUserId?: string) {
  const [state, setState] = useState<AsyncState<LeaderboardEntry[]>>({
    data: fallbackLeaderboardData,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const leaderboardQuery = query(collection(db, 'users'), orderBy('visitedProvinceCount', 'desc'), limit(10));

    const unsubscribe = onSnapshot(
      leaderboardQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setState({ data: fallbackLeaderboardData, loading: false, error: null });
          return;
        }

        const entries = snapshot.docs.map((item, index) =>
          mapLeaderboardEntry(index + 1, item.id, item.data() as FirestoreUserProfile, currentUserId)
        );

        setState({ data: entries, loading: false, error: null });
      },
      () => {
        setState({ data: fallbackLeaderboardData, loading: false, error: 'Không tải được bảng xếp hạng.' });
      }
    );

    return unsubscribe;
  }, [currentUserId]);

  return state;
}

export function useUserCollection(uid?: string) {
  const [state, setState] = useState<AsyncState<UserCollectionItem[]>>({
    data: collectionItems.map((item) => ({
      id: item.id,
      provinceId: item.id,
      name: item.name,
      dateLabel: item.dateLabel,
      imageUrl: item.imageUrl,
      checkinCount: 1,
    })),
    loading: Boolean(uid),
    error: null,
  });

  useEffect(() => {
    if (!uid) {
      setState((previous) => ({ ...previous, loading: false }));
      return;
    }

    const collectionQuery = query(collection(db, 'checkins'), where('userId', '==', uid));

    const unsubscribe = onSnapshot(
      collectionQuery,
      (snapshot) => {
        if (snapshot.empty) {
          setState({ data: [], loading: false, error: null });
          return;
        }

        const mappedItems = mapCollectionItems(snapshot.docs.map((item) => ({ id: item.id, data: item.data() as FirestoreCheckin })));
        setState({ data: mappedItems, loading: false, error: null });
      },
      () => {
        setState({ data: [], loading: false, error: 'Không tải được bộ sưu tập check-in.' });
      }
    );

    return unsubscribe;
  }, [uid]);

  return state;
}

export async function createDemoCheckin(user: User) {
  const provinceId = 'danang';
  const provinceName = 'Đà Nẵng';
  const landmarkId = 'dragon-bridge';
  const landmarkName = 'Cầu Rồng';
  const hashtag = '#DaNangCheckin';
  const caption = 'Vừa check-in Cầu Rồng cùng VietWander, đêm nay thành phố lên đèn cực đẹp.';
  const imageUrl = designAssets.danangHero;

  const userRef = doc(db, 'users', user.uid);
  const userSnapshot = await getDoc(userRef);
  const userProfile = mapUserProfile(user.uid, userSnapshot.exists() ? (userSnapshot.data() as FirestoreUserProfile) : null);

  const userCheckinsSnapshot = await getDocs(query(collection(db, 'checkins'), where('userId', '==', user.uid)));
  const hasVisitedProvince = userCheckinsSnapshot.docs.some((item) => (item.data() as FirestoreCheckin).provinceId === provinceId);
  const nextVisitedProvinceCount = userProfile.visitedProvinceCount + (hasVisitedProvince ? 0 : 1);
  const nextVerifiedCheckinCount = userProfile.verifiedCheckinCount + 1;
  const nextLevelTitle = getLevelTitle(nextVisitedProvinceCount);

  await addDoc(collection(db, 'checkins'), {
    userId: user.uid,
    authorName: user.displayName || userProfile.displayName,
    provinceId,
    provinceName,
    landmarkId,
    landmarkName,
    hashtag,
    imageUrl,
    createdAt: serverTimestamp(),
  });

  await addDoc(collection(db, 'posts'), {
    userId: user.uid,
    authorName: user.displayName || userProfile.displayName,
    provinceId,
    provinceName,
    landmarkId,
    landmarkName,
    imageUrl,
    caption,
    hashtag,
    likeCount: 0,
    commentCount: 0,
    createdAt: serverTimestamp(),
  });

  await setDoc(
    userRef,
    {
      uid: user.uid,
      displayName: user.displayName || userProfile.displayName,
      email: user.email,
      photoURL: user.photoURL ?? userProfile.photoURL,
      levelTitle: nextLevelTitle,
      visitedProvinceCount: nextVisitedProvinceCount,
      verifiedCheckinCount: nextVerifiedCheckinCount,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );

  return {
    provinceName,
    landmarkName,
    hashtag,
    isNewProvince: !hasVisitedProvince,
    nextVisitedProvinceCount,
    nextVerifiedCheckinCount,
    nextLevelTitle,
  };
}

