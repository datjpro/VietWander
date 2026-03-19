import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { bootstrapDemoData, createDemoSession, getUser, logoutApiSession, upsertUser } from '../lib/api.js';
import { demoGuestProfile, demoGuestUser, getDemoProfile } from '../lib/demo-data.js';
import { loginWithEmail, logoutCurrentUser, observeAuth, registerWithEmail } from '../lib/firebase.js';
import { readAppearanceSeed } from '../lib/settings.js';

const AuthContext = createContext(null);
const runtimeConfig = globalThis.__VIETWANDER_CONFIG__ || {};
const guestPreferenceKey = 'vietwander.demo-guest-enabled';
const demoModeEnabled = ['1', 'true', 'yes', 'on'].includes(String(runtimeConfig.VITE_DEMO_MODE || '').toLowerCase());

function readGuestPreference() {
  if (!demoModeEnabled || typeof window === 'undefined') {
    return false;
  }

  const storedValue = window.localStorage.getItem(guestPreferenceKey);
  return storedValue == null ? true : storedValue === 'true';
}

function writeGuestPreference(enabled) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(guestPreferenceKey, String(Boolean(enabled)));
}

function createGuestUser(profile = demoGuestProfile) {
  return {
    ...demoGuestUser,
    uid: profile?.uid || demoGuestUser.uid,
    email: profile?.email || demoGuestUser.email,
    displayName: profile?.displayName || demoGuestUser.displayName,
    photoURL: profile?.photoURL || profile?.avatarUrl || demoGuestUser.photoURL
  };
}

async function syncProfile(user) {
  const displayName = user.displayName || user.email?.split('@')[0] || 'Du khách m?i';
  let existingProfile = null;

  try {
    existingProfile = await getUser(user.uid);
  } catch {
    existingProfile = null;
  }

  const visitedProvinceCount = existingProfile?.visitedProvinceCount ?? existingProfile?.provincesVisited ?? 0;
  const payload = {
    displayName,
    avatarUrl: user.photoURL || null
  };

  if (!existingProfile?.preferences) {
    payload.preferences = readAppearanceSeed();
  }

  try {
    return await upsertUser(user.uid, payload);
  } catch {
    return {
      uid: user.uid,
      displayName,
      email: user.email || existingProfile?.email || null,
      avatarUrl: payload.avatarUrl,
      photoURL: payload.avatarUrl,
      username: existingProfile?.username ?? null,
      bio: existingProfile?.bio ?? '',
      homeProvinceId: existingProfile?.homeProvinceId ?? null,
      provincesVisited: visitedProvinceCount,
      visitedProvinceCount,
      verifiedCheckinCount: existingProfile?.verifiedCheckinCount ?? 0,
      badges: existingProfile?.badges ?? [],
      preferences: existingProfile?.preferences ?? payload.preferences ?? readAppearanceSeed(),
      level: existingProfile?.level ?? 1,
      levelTitle: existingProfile?.levelTitle ?? 'Du khách'
    };
  }
}

async function ensureGuestProfile() {
  const payload = {
    displayName: demoGuestProfile.displayName,
    avatarUrl: demoGuestProfile.avatarUrl,
    username: demoGuestProfile.username,
    bio: demoGuestProfile.bio,
    homeProvinceId: demoGuestProfile.homeProvinceId,
    preferences: demoGuestProfile.preferences
  };

  try {
    return await upsertUser(demoGuestProfile.uid, payload);
  } catch {
    return getDemoProfile(demoGuestProfile.uid);
  }
}

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [authMode, setAuthMode] = useState('signed-out');

  async function activateGuestMode() {
    writeGuestPreference(true);

    try {
      await createDemoSession();
    } catch {
      // Fallback local demo v?n nên ti?p t?c d? không ch?n pitch/demo.
    }

    const guestProfile = await ensureGuestProfile();
    const guestUser = createGuestUser(guestProfile);
    setAuthMode('guest');
    setUser(guestUser);
    setProfile(guestProfile);
    setReady(true);
    return guestUser;
  }

  useEffect(() => {
    let active = true;

    const unsubscribe = observeAuth(async (nextUser) => {
      if (!active) {
        return;
      }

      if (nextUser) {
        setUser(nextUser);
        setAuthMode('firebase');
        const syncedProfile = await syncProfile(nextUser);

        if (!active) {
          return;
        }

        setProfile(syncedProfile);
        setReady(true);
        return;
      }

      if (readGuestPreference()) {
        await activateGuestMode();
        return;
      }

      setAuthMode('signed-out');
      setUser(null);
      setProfile(null);
      setReady(true);
    });

    return () => {
      active = false;
      unsubscribe();
    };
  }, []);

  async function refreshProfile() {
    if (!user) {
      setProfile(null);
      return null;
    }

    try {
      const nextProfile = await getUser(user.uid);
      setProfile(nextProfile);
      return nextProfile;
    } catch {
      const fallbackProfile = authMode === 'guest' ? getDemoProfile(user.uid) : profile;
      if (fallbackProfile) {
        setProfile(fallbackProfile);
      }
      return fallbackProfile || null;
    }
  }

  async function login(input) {
    writeGuestPreference(false);
    const loggedInUser = await loginWithEmail(input);
    const syncedProfile = await syncProfile(loggedInUser);
    setAuthMode('firebase');
    setUser(loggedInUser);
    setProfile(syncedProfile);
    return loggedInUser;
  }

  async function register(input) {
    writeGuestPreference(false);
    const registeredUser = await registerWithEmail(input);
    const syncedProfile = await syncProfile(registeredUser);
    setAuthMode('firebase');
    setUser(registeredUser);
    setProfile(syncedProfile);
    return registeredUser;
  }

  async function enterGuestMode() {
    if (authMode === 'firebase') {
      await logoutCurrentUser();
    }

    return activateGuestMode();
  }

  async function exitGuestMode() {
    try {
      await logoutApiSession();
    } catch {
      // Không c?n ch?n ngu?i dùng thoát demo n?u backend không ph?n h?i.
    }

    writeGuestPreference(false);
    setAuthMode('signed-out');
    setUser(null);
    setProfile(null);
    setReady(true);
  }

  async function resetDemoData() {
    const result = await bootstrapDemoData();

    if (authMode === 'guest') {
      const nextGuestProfile = await ensureGuestProfile();
      setProfile(nextGuestProfile);
      setUser(createGuestUser(nextGuestProfile));
    } else if (user) {
      await refreshProfile();
    }

    return result;
  }

  async function logout() {
    if (authMode === 'guest') {
      await exitGuestMode();
      return;
    }

    try {
      await logoutApiSession();
    } catch {
      // Có th? không có cookie demo, b? qua an toàn.
    }

    await logoutCurrentUser();
    setProfile(null);
    setAuthMode('signed-out');
  }

  const contextValue = useMemo(
    () => ({
      ready,
      user,
      profile,
      authMode,
      demoModeEnabled,
      isGuest: authMode === 'guest',
      login,
      register,
      logout,
      refreshProfile,
      enterGuestMode,
      exitGuestMode,
      resetDemoData
    }),
    [authMode, profile, ready, user]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth ph?i du?c dùng bên trong AuthProvider.');
  }
  return context;
}
