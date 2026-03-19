import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { bootstrapDemoData, getUser, upsertUser } from '../lib/api.js';
import { demoGuestProfile, demoGuestUser, getDemoProfile } from '../lib/demo-data.js';
import { loginWithEmail, logoutCurrentUser, observeAuth, registerWithEmail } from '../lib/firebase.js';
import { getLevelTitle } from '../lib/utils.js';

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
  const displayName = user.displayName || user.email?.split('@')[0] || 'Du khách mới';
  const payload = {
    displayName,
    email: user.email || null,
    avatarUrl: user.photoURL || null,
    level: 1,
    levelTitle: getLevelTitle(0)
  };

  try {
    return await upsertUser(user.uid, payload);
  } catch {
    return payload;
  }
}

async function ensureGuestProfile() {
  const payload = {
    displayName: demoGuestProfile.displayName,
    email: demoGuestProfile.email,
    avatarUrl: demoGuestProfile.avatarUrl,
    photoURL: demoGuestProfile.photoURL,
    level: demoGuestProfile.level,
    levelTitle: demoGuestProfile.levelTitle,
    provincesVisited: demoGuestProfile.provincesVisited,
    visitedProvinceCount: demoGuestProfile.visitedProvinceCount,
    verifiedCheckinCount: demoGuestProfile.verifiedCheckinCount,
    badges: demoGuestProfile.badges,
    username: demoGuestProfile.username
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
    [ready, user, profile, authMode]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được dùng bên trong AuthProvider.');
  }
  return context;
}
