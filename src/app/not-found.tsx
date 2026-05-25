'use client'

import Link from 'next/link'
import { useEffect } from 'react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 animate-fade-in text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-primary/10 flex items-center justify-center mx-auto shadow-sm">
        <span className="text-4xl">🚧</span>
      </div>
      <h1 className="text-4xl font-black text-foreground mb-4">Under Construction</h1>
      <p className="text-foreground/70 max-w-md mx-auto mb-8">
        This page is currently in development. We are rapidly building out new features for MedBadge!
      </p>
      <Link 
        href="/" 
        className="py-3 px-8 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 transition-transform active:scale-95 shadow-lg shadow-primary/20"
      >
        Return Home
      </Link>
    </div>
  )
}
