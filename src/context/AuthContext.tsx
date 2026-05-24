'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  User, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup,
  signOut as firebaseSignOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
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
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoRole, setDemoRole] = useState<'b2c_user' | 'b2b_agency' | 'b2b_facility' | 'founder' | null>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Fetch or create profile
        const profileRef = doc(db, 'users', firebaseUser.uid)
        const profileSnap = await getDoc(profileRef)
        
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
          setProfile(newProfile)
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
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

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, demoRole, setDemoRole, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
