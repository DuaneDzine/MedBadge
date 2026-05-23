'use client'

import { useState, use } from 'react'
import Image from 'next/image'
import { User, ShieldCheck, Stethoscope, Heart, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react'

export default function PortfolioPage({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params)
  const [step, setStep] = useState(1)
  
  // Form State
  const [role, setRole] = useState<'clinical' | 'patient'>('clinical')
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [reviewerName, setReviewerName] = useState('')
  const [rating, setRating] = useState(5)
  const [review, setReview] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulated submission to Firestore Cloud Function
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col justify-between transition-colors duration-300">
      <div className="max-w-md mx-auto w-full px-4 py-8 space-y-6 animate-fade-in flex-grow">
        
        {/* Branding Header */}
        <div className="flex justify-center mb-2">
          <div className="relative w-16 h-16 bg-white rounded-2xl p-1 shadow-sm border border-gray-100 dark:border-gray-800">
            <Image src="/logo.png" alt="MedBadge Logo" fill className="object-contain rounded-xl" priority />
          </div>
        </div>

        <header className="text-center space-y-4">
          <div className="relative h-24 w-24 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-card bg-card">
            <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-primary capitalize">
              {userId.charAt(0)}
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-foreground capitalize tracking-tight">
              {userId.replace('-', ' ')}
            </h1>
            <p className="text-primary font-medium mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Verified ICU Nurse
            </p>
          </div>
        </header>

        <div className="bg-card rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800 relative overflow-hidden">
          {submitted ? (
            <div className="text-center py-12 text-primary animate-fade-in">
              <div className="text-6xl mb-4 animate-bounce">✨</div>
              <h3 className="font-bold text-2xl mb-2">Review Submitted!</h3>
              <p className="text-sm opacity-80">Thank you. Your review is being geo-verified and sanitized.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 pb-24">
              
              {/* Progress Indicator */}
              <div className="flex justify-center gap-2 mb-8">
                {[1, 2, 3].map((num) => (
                  <div key={num} className={`h-2 rounded-full transition-all duration-300 ${step === num ? 'w-8 bg-primary' : step > num ? 'w-4 bg-primary/50' : 'w-4 bg-gray-200 dark:bg-gray-800'}`} />
                ))}
              </div>

              {/* Step 1: Relationship */}
              {step === 1 && (
                <div className="animate-slide-up space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground mb-2">Step 1: Your Relationship</h2>
                    <p className="text-sm text-foreground/60">How do you know {userId.replace('-', ' ')}?</p>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <button type="button" onClick={() => setRole('clinical')} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === 'clinical' ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-gray-200 dark:border-gray-800 text-foreground/70 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                      <div className={`p-3 rounded-xl ${role === 'clinical' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">Clinical Peer</h3>
                        <p className="text-xs opacity-80 mt-1">Doctor, Nurse, Admin, etc.</p>
                      </div>
                    </button>

                    <button type="button" onClick={() => setRole('patient')} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${role === 'patient' ? 'border-primary bg-primary/10 text-primary shadow-sm' : 'border-gray-200 dark:border-gray-800 text-foreground/70 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
                      <div className={`p-3 rounded-xl ${role === 'patient' ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800'}`}>
                        <Heart className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold">Patient / Family</h3>
                        <p className="text-xs opacity-80 mt-1">Received care from this provider.</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Identity */}
              {step === 2 && (
                <div className="animate-slide-up space-y-6">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground mb-2">Step 2: Identity Details</h2>
                    <p className="text-sm text-foreground/60">Would you like to remain anonymous?</p>
                  </div>

                  <div className="flex bg-background p-1 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <button type="button" onClick={() => setIsAnonymous(true)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-xl text-sm font-bold transition-all ${isAnonymous ? 'bg-card shadow-sm text-foreground border border-gray-100 dark:border-gray-700' : 'text-foreground/50 hover:bg-background/50'}`}>
                      <User className="w-5 h-5 mb-1" /> Anonymous
                    </button>
                    <button type="button" onClick={() => setIsAnonymous(false)} className={`flex-1 flex flex-col items-center justify-center gap-1 py-4 rounded-xl text-sm font-bold transition-all ${!isAnonymous ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground/50 hover:bg-background/50'}`}>
                      <ShieldCheck className="w-5 h-5 mb-1" /> Verified Identity
                    </button>
                  </div>
                  
                  {!isAnonymous && (
                    <div className="animate-fade-in space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <div>
                        <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Your Full Name</label>
                        <input type="text" placeholder="Jane Doe" required value={reviewerName} onChange={(e) => setReviewerName(e.target.value)} className="w-full p-4 rounded-xl bg-background border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-primary outline-none transition-all font-medium" />
                      </div>
                      <button type="button" className="w-full py-3 text-sm font-semibold text-primary bg-primary/10 rounded-xl hover:bg-primary/20 transition-colors flex items-center justify-center gap-2">
                        <ShieldCheck className="w-4 h-4" /> Verify via MedBadge Account (Optional)
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3: Review */}
              {step === 3 && (
                <div className="animate-slide-up space-y-8">
                  <div className="text-center">
                    <h2 className="text-xl font-bold text-foreground mb-2">Step 3: Feedback</h2>
                    <p className="text-sm text-foreground/60">Rate your experience with {userId.replace('-', ' ')}</p>
                  </div>

                  <div className="text-center bg-background/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                    <label className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-4">Aptitude Rating</label>
                    <div className="flex gap-2 sm:gap-3 justify-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} type="button" onClick={() => setRating(star)} className={`text-5xl transition-all active:scale-90 ${star <= rating ? 'text-yellow-400 drop-shadow-md scale-110' : 'text-gray-200 dark:text-gray-700 hover:text-yellow-200'}`}>
                          ★
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="review" className="block text-xs font-bold text-foreground/70 uppercase tracking-wider mb-2 ml-1">Written Review</label>
                    <textarea
                      id="review"
                      rows={5}
                      required
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      className="w-full rounded-2xl bg-background text-foreground shadow-inner focus:ring-2 focus:ring-primary p-4 border border-gray-200 dark:border-gray-700 outline-none transition-all resize-none text-lg"
                      placeholder="Incredible bedside manner and extreme attention to detail..."
                    />
                  </div>
                </div>
              )}

              {/* Sticky Mobile Navigation Bar */}
              <div className="fixed bottom-0 left-0 right-0 p-4 bg-background/90 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 flex justify-center z-50">
                <div className="w-full max-w-md flex gap-3">
                  {step > 1 && (
                    <button type="button" onClick={handleBack} className="py-4 px-4 bg-card border border-gray-200 dark:border-gray-700 text-foreground font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center">
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                  )}
                  
                  {step < 3 ? (
                    <button type="button" onClick={handleNext} className="flex-1 py-4 px-6 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:opacity-90 transition-transform active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                      Continue <ChevronRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button type="submit" className="flex-1 py-4 px-6 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:opacity-90 transition-transform active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2">
                      Submit Review <CheckCircle2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>

            </form>
          )}
        </div>
      </div>
    </main>
  )
}
