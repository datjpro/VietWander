import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getUser, upsertUser } from '../lib/api.js';
import { loginWithEmail, logoutCurrentUser, observeAuth, registerWithEmail } from '../lib/firebase.js';
import { getLevelTitle } from '../lib/utils.js';

const AuthContext = createContext(null);

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

export function AuthProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = observeAuth(async (nextUser) => {
      setUser(nextUser);

      if (!nextUser) {
        setProfile(null);
        setReady(true);
        return;
      }

      const syncedProfile = await syncProfile(nextUser);
      setProfile(syncedProfile);
      setReady(true);
    });

    return unsubscribe;
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
      return profile;
    }
  }

  async function login(input) {
    const loggedInUser = await loginWithEmail(input);
    const syncedProfile = await syncProfile(loggedInUser);
    setProfile(syncedProfile);
    return loggedInUser;
  }

  async function register(input) {
    const registeredUser = await registerWithEmail(input);
    const syncedProfile = await syncProfile(registeredUser);
    setProfile(syncedProfile);
    return registeredUser;
  }

  async function logout() {
    await logoutCurrentUser();
    setProfile(null);
  }

  const contextValue = useMemo(
    () => ({
      ready,
      user,
      profile,
      login,
      register,
      logout,
      refreshProfile
    }),
    [ready, user, profile]
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
