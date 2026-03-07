import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

type SignUpInput = {
  displayName: string;
  email: string;
  password: string;
};

type SignInInput = {
  email: string;
  password: string;
};

type AuthContextValue = {
  user: User | null;
  initializing: boolean;
  signInWithEmail: (input: SignInInput) => Promise<void>;
  signUpWithEmail: (input: SignUpInput) => Promise<void>;
  signOutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      initializing,
      async signInWithEmail({ email, password }) {
        await signInWithEmailAndPassword(auth, email.trim(), password);
      },
      async signUpWithEmail({ displayName, email, password }) {
        const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const trimmedName = displayName.trim();

        if (trimmedName) {
          await updateProfile(credential.user, { displayName: trimmedName });
        }

        try {
          await setDoc(
            doc(db, 'users', credential.user.uid),
            {
              uid: credential.user.uid,
              displayName: trimmedName || credential.user.email?.split('@')[0] || 'Du khách mới',
              email: credential.user.email,
              photoURL: credential.user.photoURL ?? null,
              level: 1,
              levelTitle: 'Du khách',
              visitedProvinceCount: 0,
              verifiedCheckinCount: 0,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            },
            { merge: true }
          );
        } catch (firestoreError) {
          console.warn('Unable to create Firestore user profile', firestoreError);
        }
      },
      async signOutUser() {
        await signOut(auth);
      },
    }),
    [initializing, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
