import { getRepository } from '../repositories/index.js';
import { seedProvinces } from '../data/seed.js';
import { badRequest, notFound } from '../lib/http-error.js';
import { optionalGeoPoint, requireString } from '../lib/validation.js';

const defaultUserPreferences = {
  theme: 'system',
  language: 'vi',
  showLocation: true,
  autoplayVideo: false
};

function createTimestamp() {
  return new Date().toISOString();
}

function hasOwn(source, key) {
  return Object.prototype.hasOwnProperty.call(source, key);
}

function readValue(input, key, fallbackValue) {
  return hasOwn(input, key) ? input[key] : fallbackValue;
}

function normalizeUserPreferences(inputPreferences = {}, existingPreferences = {}) {
  const source = inputPreferences && typeof inputPreferences === 'object' ? inputPreferences : {};
  const current = existingPreferences && typeof existingPreferences === 'object' ? existingPreferences : {};

  return {
    theme: source.theme ?? current.theme ?? defaultUserPreferences.theme,
    language: source.language ?? current.language ?? defaultUserPreferences.language,
    showLocation: source.showLocation ?? current.showLocation ?? defaultUserPreferences.showLocation,
    autoplayVideo: source.autoplayVideo ?? current.autoplayVideo ?? defaultUserPreferences.autoplayVideo
  };
}

function slugToBadge(province) {
  return province.code || province.id.toUpperCase();
}

function buildProvinceHashtag(province) {
  return `#${province.code || province.name.replace(/\s+/g, '')}Checkin`;
}

function normalizeUserUpsert(userId, input = {}, existingUser = null) {
  const now = createTimestamp();
  const displayName = readValue(input, 'displayName', existingUser?.displayName ?? 'Du khách mới');
  const avatarUrl = hasOwn(input, 'avatarUrl')
    ? input.avatarUrl
    : hasOwn(input, 'photoURL')
      ? input.photoURL
      : (existingUser?.avatarUrl ?? existingUser?.photoURL ?? null);
  const provincesVisited =
    input.provincesVisited ??
    input.visitedProvinceCount ??
    existingUser?.provincesVisited ??
    existingUser?.visitedProvinceCount ??
    0;
  const badges = Array.isArray(input.badges) ? [...new Set(input.badges)] : existingUser?.badges ?? [];
  const level = readValue(input, 'level', existingUser?.level ?? 1);
  const levelTitle = readValue(input, 'levelTitle', existingUser?.levelTitle ?? 'Du khách');
  const verifiedCheckinCount = readValue(input, 'verifiedCheckinCount', existingUser?.verifiedCheckinCount ?? 0);
  const preferences = normalizeUserPreferences(input.preferences, existingUser?.preferences);

  return {
    uid: userId,
    displayName,
    username: readValue(input, 'username', existingUser?.username ?? null),
    bio: readValue(input, 'bio', existingUser?.bio ?? ''),
    avatarUrl,
    photoURL: avatarUrl,
    email: readValue(input, 'email', existingUser?.email ?? null),
    homeProvinceId: readValue(input, 'homeProvinceId', existingUser?.homeProvinceId ?? null),
    preferences,
    level,
    levelTitle,
    provincesVisited,
    visitedProvinceCount: provincesVisited,
    verifiedCheckinCount,
    badges,
    createdAt: existingUser?.createdAt ?? now,
    lastActive: input.lastActive ?? now,
    updatedAt: now
  };
}

function normalizeProvinceUpsert(provinceId, input = {}, existingProvince = null) {
  const now = createTimestamp();

  return {
    id: provinceId,
    name: input.name ?? existingProvince?.name ?? null,
    fullName: input.fullName ?? input.name ?? existingProvince?.fullName ?? existingProvince?.name ?? null,
    code: input.code ?? existingProvince?.code ?? null,
    description: input.description ?? existingProvince?.description ?? '',
    imageUrl: input.imageUrl ?? existingProvince?.imageUrl ?? null,
    landmarks: Array.isArray(input.landmarks) ? input.landmarks : existingProvince?.landmarks ?? [],
    popularTags: Array.isArray(input.popularTags) ? input.popularTags : existingProvince?.popularTags ?? [],
    createdAt: existingProvince?.createdAt ?? input.createdAt ?? now,
    updatedAt: now
  };
}

function normalizeStandalonePost(input, user, province) {
  const now = createTimestamp();
  const photoUrl = input.photoUrl ?? input.imageUrl ?? null;

  return {
    id: input.id,
    userId: user.uid,
    userUid: user.uid,
    authorName: user.displayName,
    provinceId: province.id,
    provinceName: province.name,
    landmarkId: input.landmarkId ?? null,
    landmarkName: input.landmarkName ?? null,
    photoUrl,
    imageUrl: photoUrl,
    caption: input.caption ?? '',
    hashtag: input.hashtag ?? buildProvinceHashtag(province),
    isPublic: input.isPublic ?? true,
    likesCount: input.likesCount ?? 0,
    commentsCount: input.commentsCount ?? 0,
    createdAt: input.createdAt ?? now
  };
}

function normalizeCheckinPayload(input, user, province) {
  const now = createTimestamp();
  const photoUrl = input.photoUrl ?? input.imageUrl ?? null;

  return {
    id: input.id,
    userId: user.uid,
    provinceId: province.id,
    provinceName: province.name,
    landmarkId: input.landmarkId ?? null,
    landmarkName: input.landmarkName ?? null,
    photoUrl,
    imageUrl: photoUrl,
    caption: input.caption ?? '',
    location: input.location ?? null,
    createdAt: input.createdAt ?? now,
    likesCount: input.likesCount ?? 0,
    commentsCount: input.commentsCount ?? 0
  };
}

export function createTravelService(repository = getRepository()) {
  return {
    repository,

    async getHealth() {
      return {
        service: 'vietwander-backend',
        status: 'ok',
        databaseMode: repository.mode,
        schemaVersion: '2026-03-08'
      };
    },

    async getApiIndex() {
      return {
        message: 'VietWander backend is ready.',
        databaseMode: repository.mode,
        resources: {
          health: '/health',
          bootstrap: '/api/bootstrap/demo-data',
          users: '/api/users/:userId',
          provinces: '/api/provinces',
          provincePosts: '/api/provinces/:provinceId/posts',
          checkins: '/api/checkins',
          posts: '/api/posts',
          leaderboard: '/api/leaderboard',
          feedAlias: '/api/feed'
        }
      };
    },

    async seedProvinces(options = {}) {
      return repository.seedProvinces(seedProvinces, options);
    },

    async bootstrapDemoData() {
      return repository.seedDemoData();
    },

    async listProvinces() {
      return repository.listProvinces();
    },

    async getProvince(provinceId) {
      const province = await repository.getProvinceById(provinceId);

      if (!province) {
        throw notFound('Không tìm thấy tỉnh/thành.', { provinceId });
      }

      return province;
    },

    async upsertProvince(provinceId, input = {}) {
      const existingProvince = await repository.getProvinceById(provinceId);
      const provincePayload = normalizeProvinceUpsert(provinceId, input, existingProvince);

      if (!provincePayload.name || !provincePayload.code) {
        throw badRequest('Province cần ít nhất `name` và `code`.');
      }

      return repository.upsertProvince(provinceId, provincePayload);
    },

    async getUser(userId) {
      const user = await repository.getUserById(userId);

      if (!user) {
        throw notFound('Không tìm thấy user.', { userId });
      }

      return normalizeUserUpsert(userId, user, user);
    },

    async upsertUser(userId, input = {}) {
      const existingUser = await repository.getUserById(userId);
      const userPayload = normalizeUserUpsert(userId, input, existingUser);
      return repository.upsertUser(userId, userPayload);
    },

    async listCheckins(filters = {}) {
      return repository.listCheckins(filters);
    },

    async listPosts(filters = {}) {
      return repository.listPosts(filters);
    },

    async listProvincePosts(provinceId, filters = {}) {
      await this.getProvince(provinceId);
      return repository.listProvincePosts(provinceId, filters);
    },

    async getLeaderboard(limit) {
      return repository.getLeaderboard(limit);
    },

    async createPost(input = {}) {
      const userId = requireString(input.userId, 'userId');
      const provinceId = requireString(input.provinceId, 'provinceId');

      const [existingUser, province] = await Promise.all([
        repository.getUserById(userId),
        repository.getProvinceById(provinceId)
      ]);

      if (!province) {
        throw notFound('Không tìm thấy tỉnh/thành để tạo post.', { provinceId });
      }

      const user = existingUser ?? (await this.upsertUser(userId, { displayName: 'Du khách mới' }));
      const postPayload = normalizeStandalonePost({ ...input, userId, provinceId }, user, province);
      const post = await repository.createPost(postPayload);

      if (post.isPublic !== false) {
        await repository.createProvincePost(province.id, post);
      }

      await repository.upsertUser(
        user.uid,
        normalizeUserUpsert(user.uid, { lastActive: createTimestamp() }, user)
      );

      return post;
    },

    async createCheckin(input = {}) {
      const userId = requireString(input.userId, 'userId');
      const provinceId = requireString(input.provinceId, 'provinceId');
      const photoUrl = requireString(input.photoUrl ?? input.imageUrl, 'photoUrl');
      const location = optionalGeoPoint(input.location);

      const [existingUser, province] = await Promise.all([
        repository.getUserById(userId),
        repository.getProvinceById(provinceId)
      ]);

      if (!province) {
        throw notFound('Không tìm thấy tỉnh/thành để check-in.', { provinceId });
      }

      const user = existingUser ?? (await this.upsertUser(userId, { displayName: 'Du khách mới' }));
      const priorProvinceCheckins = await repository.listCheckins({
        userId: user.uid,
        provinceId: province.id,
        limit: 1
      });
      const isNewProvince = priorProvinceCheckins.length === 0;

      const checkinPayload = normalizeCheckinPayload(
        {
          ...input,
          userId,
          provinceId,
          photoUrl,
          location
        },
        user,
        province
      );
      const checkin = await repository.createCheckin(checkinPayload);
      const mirroredPostPayload = {
        ...normalizeStandalonePost(
          {
            ...input,
            userId,
            provinceId,
            photoUrl
          },
          user,
          province
        ),
        id: checkin.id
      };

      await repository.createPost(mirroredPostPayload);
      await repository.createProvincePost(province.id, mirroredPostPayload);

      const currentVisited = user.provincesVisited ?? user.visitedProvinceCount ?? 0;
      const nextVisited = isNewProvince ? currentVisited + 1 : currentVisited;
      const nextBadges = new Set(user.badges ?? []);

      if (isNewProvince) {
        nextBadges.add(slugToBadge(province));
      }

      const nextUser = await repository.upsertUser(
        user.uid,
        normalizeUserUpsert(
          user.uid,
          {
            badges: [...nextBadges],
            provincesVisited: nextVisited,
            visitedProvinceCount: nextVisited,
            verifiedCheckinCount: (user.verifiedCheckinCount ?? 0) + 1,
            lastActive: createTimestamp()
          },
          user
        )
      );

      return {
        checkin,
        provincePostId: mirroredPostPayload.id,
        isNewProvince,
        user: nextUser
      };
    }
  };
}
