import { randomUUID } from 'node:crypto';
import { GeoPoint } from 'firebase-admin/firestore';
import { getFirestoreAdmin } from '../config/firebase-admin.js';
import { seedCheckins, seedPosts, seedProvinces, seedUsers } from '../data/seed.js';
import { serializeValue, withDocumentId } from '../lib/serialization.js';

function normalizeWritePayload(payload) {
  const nextPayload = { ...payload };

  if (nextPayload.location && typeof nextPayload.location === 'object' && 'lat' in nextPayload.location && 'lng' in nextPayload.location) {
    nextPayload.location = new GeoPoint(nextPayload.location.lat, nextPayload.location.lng);
  }

  return nextPayload;
}

async function snapshotToArray(snapshot) {
  return snapshot.docs.map((item) => withDocumentId(item.id, item.data()));
}

export function createFirestoreRepository() {
  const db = getFirestoreAdmin();

  if (!db) {
    throw new Error('Firebase Admin chưa được cấu hình cho backend.');
  }

  return {
    mode: 'firestore',

    async listProvinces() {
      const snapshot = await db.collection('provinces').get();
      return snapshotToArray(snapshot);
    },

    async getProvinceById(provinceId) {
      const snapshot = await db.collection('provinces').doc(provinceId).get();
      return snapshot.exists ? withDocumentId(snapshot.id, snapshot.data()) : null;
    },

    async upsertProvince(provinceId, provinceData) {
      await db.collection('provinces').doc(provinceId).set(normalizeWritePayload(provinceData), { merge: true });
      return this.getProvinceById(provinceId);
    },

    async seedProvinces(provinces, options = {}) {
      const overwrite = Boolean(options.overwrite);
      const writtenItems = [];

      for (const province of provinces) {
        const docRef = db.collection('provinces').doc(province.id);
        const existing = await docRef.get();

        if (existing.exists && !overwrite) {
          writtenItems.push(withDocumentId(existing.id, existing.data()));
          continue;
        }

        await docRef.set(normalizeWritePayload(province), { merge: overwrite });
        const nextSnapshot = await docRef.get();
        writtenItems.push(withDocumentId(nextSnapshot.id, nextSnapshot.data()));
      }

      return writtenItems;
    },

    async getUserById(userId) {
      const snapshot = await db.collection('users').doc(userId).get();
      return snapshot.exists ? withDocumentId(snapshot.id, snapshot.data()) : null;
    },

    async upsertUser(userId, userData) {
      await db.collection('users').doc(userId).set(normalizeWritePayload(userData), { merge: true });
      return this.getUserById(userId);
    },

    async listCheckins(filters = {}) {
      const { userId, provinceId, limit = 20 } = filters;
      let queryRef = db.collection('checkins');

      if (userId) {
        queryRef = queryRef.where('userId', '==', userId);
      } else if (provinceId) {
        queryRef = queryRef.where('provinceId', '==', provinceId);
      }

      queryRef = queryRef.orderBy('createdAt', 'desc').limit(limit);
      const snapshot = await queryRef.get();
      let items = await snapshotToArray(snapshot);

      if (userId && provinceId) {
        items = items.filter((item) => item.provinceId === provinceId);
      }

      return items;
    },

    async createCheckin(checkinData) {
      const id = checkinData.id ?? randomUUID();
      const docRef = db.collection('checkins').doc(id);
      await docRef.set(normalizeWritePayload(checkinData), { merge: false });
      const snapshot = await docRef.get();
      return withDocumentId(snapshot.id, snapshot.data());
    },

    async listPosts(filters = {}) {
      const { provinceId, userId, limit = 20 } = filters;
      let queryRef = db.collection('posts');

      if (provinceId) {
        queryRef = queryRef.where('provinceId', '==', provinceId);
      } else if (userId) {
        queryRef = queryRef.where('userId', '==', userId);
      }

      queryRef = queryRef.orderBy('createdAt', 'desc').limit(limit);
      const snapshot = await queryRef.get();
      let items = await snapshotToArray(snapshot);

      if (provinceId && userId) {
        items = items.filter((item) => item.userId === userId);
      }

      return items;
    },

    async createPost(postData) {
      const id = postData.id ?? randomUUID();
      const docRef = db.collection('posts').doc(id);
      await docRef.set(normalizeWritePayload(postData), { merge: false });
      const snapshot = await docRef.get();
      return withDocumentId(snapshot.id, snapshot.data());
    },

    async listProvincePosts(provinceId, filters = {}) {
      const limit = filters.limit ?? 20;
      const snapshot = await db
        .collection('provinces')
        .doc(provinceId)
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      return snapshotToArray(snapshot);
    },

    async createProvincePost(provinceId, postData) {
      const id = postData.id ?? randomUUID();
      const docRef = db.collection('provinces').doc(provinceId).collection('posts').doc(id);
      await docRef.set(normalizeWritePayload(postData), { merge: false });
      const snapshot = await docRef.get();
      return withDocumentId(snapshot.id, snapshot.data());
    },

    async getLeaderboard(limit = 10) {
      const snapshot = await db.collection('users').orderBy('visitedProvinceCount', 'desc').limit(limit).get();
      return snapshotToArray(snapshot);
    },

    async seedDemoData() {
      await this.seedProvinces(seedProvinces, { overwrite: false });

      for (const user of seedUsers) {
        await this.upsertUser(user.id, user);
      }

      for (const post of seedPosts) {
        await this.createPost(post);
        await this.createProvincePost(post.provinceId, post);
      }

      for (const checkin of seedCheckins) {
        await this.createCheckin(checkin);
      }

      return {
        provinces: seedProvinces.length,
        users: seedUsers.length,
        posts: seedPosts.length,
        checkins: seedCheckins.length,
      };
    },
  };
}
