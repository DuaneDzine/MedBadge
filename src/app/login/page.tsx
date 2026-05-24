'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShieldCheck, Mail, ArrowLeft } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, sendVerificationEmail, user } = useAuth()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  // Redirect if already logged in
  if (user) {
    router.push('/dashboard')
    return null
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      if (isForgotPassword) {
        await resetPassword(email)
        setMessage('Password reset email sent! Check your inbox.')
        setIsForgotPassword(false)
      } else if (isSignUp) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.')
        }
        await signUpWithEmail(email, password)
        await sendVerificationEmail()
        setMessage('Account created! Please check your email to verify your account.')
        setTimeout(() => router.push('/dashboard'), 3000)
      } else {
        await signInWithEmail(email, password)
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4 transition-colors duration-300 relative">
      
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-8 left-8 flex items-center gap-2 text-foreground/60 hover:text-primary font-bold transition-colors">
        <ArrowLeft className="w-5 h-5" /> Back to Home
      </Link>

      <div className="w-full max-w-md bg-card p-8 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-800 animate-fade-in mt-12 md:mt-0">
        
        <div className="flex justify-center mb-8">
          <div className="relative w-24 h-24 bg-white rounded-3xl shadow-sm border border-gray-100 p-2">
            <Image src="/logo.png" alt="MedBadge Logo" fill className="object-contain rounded-2xl" priority />
          </div>
        </div>
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-foreground tracking-tight">Welcome Back</h1>
          <p className="text-foreground/70 mt-2">Sign in to your verified MedBadge portfolio.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 p-4 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium border border-emerald-100 text-center">
            {message}
          </div>
        )}

        {!isForgotPassword && (
          <>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-white text-gray-900 border border-gray-200 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 mb-6"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {loading ? 'Authenticating...' : 'Sign in with Google Workspace'}
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-foreground/50">Or continue with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground/80 mb-1">Business Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 p-3 bg-background border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                placeholder="doctor@hospital.org" 
              />
            </div>
          </div>
          {!isForgotPassword && (
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-foreground/80">Password</label>
                  {!isSignUp && (
                    <button type="button" onClick={() => setIsForgotPassword(true)} className="text-xs text-primary hover:underline font-medium">
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-background border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                  placeholder="••••••••" 
                />
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-sm font-semibold text-foreground/80 mb-1">Confirm Password</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-3 bg-background border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
              )}
            </>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-transform active:scale-[0.98] shadow-lg shadow-primary/20 disabled:opacity-50 mt-4"
          >
            {isForgotPassword ? 'Send Reset Link' : isSignUp ? 'Create Account' : 'Sign In Securely'}
          </button>
        </form>
        
        <div className="mt-4 text-center text-sm">
          {isForgotPassword ? (
            <button type="button" onClick={() => setIsForgotPassword(false)} className="text-primary hover:underline font-bold">
              Back to Sign In
            </button>
          ) : (
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-primary hover:underline font-bold">
              {isSignUp ? 'Already have an account? Sign In' : 'Need an account? Sign Up'}
            </button>
          )}
        </div>
        
        <p className="text-center text-sm text-foreground/60 mt-8">
          By signing in, you agree to our Terms of Service.
        </p>
      </div>
    </main>
  )
}
