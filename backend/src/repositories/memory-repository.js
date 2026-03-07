import { randomUUID } from 'node:crypto';
import { seedCheckins, seedPosts, seedProvinces, seedUsers } from '../data/seed.js';
import { serializeValue } from '../lib/serialization.js';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function sortByCreatedAtDesc(items) {
  return [...items].sort((left, right) => {
    const leftTime = new Date(left.createdAt ?? 0).getTime();
    const rightTime = new Date(right.createdAt ?? 0).getTime();
    return rightTime - leftTime;
  });
}

function createInitialState() {
  const provinces = new Map(seedProvinces.map((item) => [item.id, clone(item)]));
  const users = new Map(seedUsers.map((item) => [item.id, clone(item)]));
  const posts = new Map(seedPosts.map((item) => [item.id, clone(item)]));
  const checkins = new Map(seedCheckins.map((item) => [item.id, clone(item)]));
  const provincePosts = new Map();

  for (const province of seedProvinces) {
    provincePosts.set(province.id, []);
  }

  for (const post of seedPosts) {
    const items = provincePosts.get(post.provinceId) ?? [];
    items.push(clone(post));
    provincePosts.set(post.provinceId, items);
  }

  return {
    provinces,
    users,
    posts,
    checkins,
    provincePosts,
  };
}

const state = createInitialState();

function resetMap(targetMap, sourceMap) {
  targetMap.clear();

  for (const [key, value] of sourceMap.entries()) {
    targetMap.set(key, clone(value));
  }
}

function resetState() {
  const initialState = createInitialState();
  resetMap(state.provinces, initialState.provinces);
  resetMap(state.users, initialState.users);
  resetMap(state.posts, initialState.posts);
  resetMap(state.checkins, initialState.checkins);
  resetMap(state.provincePosts, initialState.provincePosts);
}

function ensureProvinceBucket(provinceId) {
  if (!state.provincePosts.has(provinceId)) {
    state.provincePosts.set(provinceId, []);
  }

  return state.provincePosts.get(provinceId);
}

function applyLimit(items, limit) {
  return items.slice(0, limit);
}

export function createMemoryRepository() {
  return {
    mode: 'memory',

    async listProvinces() {
      return [...state.provinces.values()].map(serializeValue);
    },

    async getProvinceById(provinceId) {
      const province = state.provinces.get(provinceId);
      return province ? serializeValue(province) : null;
    },

    async upsertProvince(provinceId, provinceData) {
      const existing = state.provinces.get(provinceId) ?? {};
      const nextProvince = {
        ...existing,
        ...clone(provinceData),
        id: provinceId,
      };

      state.provinces.set(provinceId, nextProvince);
      ensureProvinceBucket(provinceId);
      return serializeValue(nextProvince);
    },

    async seedProvinces(provinces, options = {}) {
      const overwrite = Boolean(options.overwrite);
      const writtenItems = [];

      for (const province of provinces) {
        if (!overwrite && state.provinces.has(province.id)) {
          writtenItems.push(serializeValue(state.provinces.get(province.id)));
          continue;
        }

        state.provinces.set(province.id, clone(province));
        ensureProvinceBucket(province.id);
        writtenItems.push(serializeValue(province));
      }

      return writtenItems;
    },

    async getUserById(userId) {
      const user = state.users.get(userId);
      return user ? serializeValue(user) : null;
    },

    async upsertUser(userId, userData) {
      const existing = state.users.get(userId) ?? {};
      const nextUser = {
        ...existing,
        ...clone(userData),
        id: userId,
        uid: userId,
      };

      state.users.set(userId, nextUser);
      return serializeValue(nextUser);
    },

    async listCheckins(filters = {}) {
      const { userId, provinceId, limit = 20 } = filters;
      let items = [...state.checkins.values()];

      if (userId) {
        items = items.filter((item) => item.userId === userId);
      }

      if (provinceId) {
        items = items.filter((item) => item.provinceId === provinceId);
      }

      return applyLimit(sortByCreatedAtDesc(items), limit).map(serializeValue);
    },

    async createCheckin(checkinData) {
      const id = checkinData.id ?? randomUUID();
      const nextCheckin = {
        ...clone(checkinData),
        id,
      };

      state.checkins.set(id, nextCheckin);
      return serializeValue(nextCheckin);
    },

    async listPosts(filters = {}) {
      const { provinceId, userId, limit = 20 } = filters;
      let items = [...state.posts.values()];

      if (provinceId) {
        items = items.filter((item) => item.provinceId === provinceId);
      }

      if (userId) {
        items = items.filter((item) => item.userId === userId);
      }

      return applyLimit(sortByCreatedAtDesc(items), limit).map(serializeValue);
    },

    async createPost(postData) {
      const id = postData.id ?? randomUUID();
      const nextPost = {
        ...clone(postData),
        id,
      };

      state.posts.set(id, nextPost);
      return serializeValue(nextPost);
    },

    async listProvincePosts(provinceId, filters = {}) {
      const limit = filters.limit ?? 20;
      const items = ensureProvinceBucket(provinceId);
      return applyLimit(sortByCreatedAtDesc(items), limit).map(serializeValue);
    },

    async createProvincePost(provinceId, postData) {
      const items = ensureProvinceBucket(provinceId);
      const nextPost = {
        ...clone(postData),
        id: postData.id ?? randomUUID(),
      };

      const existingIndex = items.findIndex((item) => item.id === nextPost.id);

      if (existingIndex >= 0) {
        items[existingIndex] = nextPost;
      } else {
        items.push(nextPost);
      }

      return serializeValue(nextPost);
    },

    async getLeaderboard(limit = 10) {
      const items = [...state.users.values()].sort((left, right) => {
        const leftScore = left.provincesVisited ?? left.visitedProvinceCount ?? 0;
        const rightScore = right.provincesVisited ?? right.visitedProvinceCount ?? 0;
        return rightScore - leftScore;
      });

      return applyLimit(items, limit).map(serializeValue);
    },

    async seedDemoData() {
      resetState();

      return {
        provinces: seedProvinces.length,
        users: seedUsers.length,
        posts: seedPosts.length,
        checkins: seedCheckins.length,
      };
    },
  };
}
