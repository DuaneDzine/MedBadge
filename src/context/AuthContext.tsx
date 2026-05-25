'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore'
import { UserProfile } from '@/lib/types'

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  demoRole: 'b2c_user' | 'b2b_agency' | 'b2b_facility' | 'founder' | null;
  setDemoRole: (role: 'b2c_user' | 'b2b_agency' | 'b2b_facility' | 'founder' | null) => void;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (e: string, p: string) => Promise<void>;
  signUpWithEmail: (e: string, p: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoRole, setDemoRole] = useState<'b2c_user' | 'b2b_agency' | 'b2b_facility' | 'founder' | null>(null)

  useEffect(() => {
    let unsubscribeSnapshot: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        const profileRef = doc(db, 'users', firebaseUser.uid)
        
        // Listen to realtime updates on the user document
        unsubscribeSnapshot = onSnapshot(profileRef, async (profileSnap) => {
          if (profileSnap.exists()) {
            setProfile(profileSnap.data() as UserProfile)
          } else {
            // Initialize new professional profile
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: firebaseUser.displayName || '',
              role: 'professional',
              role_type: 'b2c_user',
              visibility: 'private',
              metrics: { averageRating: 5.0, totalReviews: 0 },
              mfaEnabled: false,
              createdAt: Date.now(),
              updatedAt: Date.now()
            }
            await setDoc(profileRef, newProfile)
            // onSnapshot will catch this creation and update the state
          }
          setLoading(false)
        });
      } else {
        setProfile(null)
        setLoading(false)
        if (unsubscribeSnapshot) unsubscribeSnapshot();
      }
    })

    return () => {
      unsubscribeAuth()
      if (unsubscribeSnapshot) unsubscribeSnapshot();
    }
  }, [])

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    await signInWithPopup(auth, provider)
  }

  const signInWithEmail = async (e: string, p: string) => {
    await signInWithEmailAndPassword(auth, e, p)
  }

  const signUpWithEmail = async (e: string, p: string) => {
    await createUserWithEmailAndPassword(auth, e, p)
  }

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email)
  }

  const sendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, demoRole, setDemoRole, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, sendVerificationEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
