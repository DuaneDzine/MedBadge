'use client'

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, ShieldCheck, TrendingUp, Activity, CheckCircle2, Menu, X, Gift, SmartphoneNfc } from "lucide-react"

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <main className="min-h-screen bg-background text-foreground font-sans overflow-x-hidden selection:bg-primary/20">
      
      {/* 1. Global Navigation (Sticky, Glassmorphism, Bigger Logo) */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-28 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-16 h-16 md:w-24 md:h-24 bg-white rounded-[1.5rem] shadow-md overflow-hidden flex items-center justify-center p-2 border border-gray-100 group-hover:scale-105 transition-transform duration-300">
              <Image src="/logo.png" alt="MedBadge Logo" fill className="object-contain" priority />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl md:text-3xl font-black tracking-tight text-foreground leading-none">
                MedBadge
              </span>
              <span className="text-primary font-bold text-xs tracking-widest uppercase mt-1">Enterprise</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-10 text-sm font-bold text-foreground/80 tracking-wide uppercase">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#enterprise" className="hover:text-primary transition-colors">Enterprise</a>
            <a href="#roadmap" className="hover:text-primary transition-colors">Roadmap</a>
            <a href="#pricing" className="hover:text-primary transition-colors">Pricing</a>
          </div>

          <div className="hidden lg:flex items-center gap-6">
            <Link href="/login" className="text-sm font-bold hover:text-primary transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-black uppercase tracking-wider shadow-lg shadow-primary/30 hover:scale-105 hover:shadow-primary/50 transition-all">
              Claim Badge
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="lg:hidden p-2 text-foreground/80 hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
          </button>
        </div>
        
        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-28 left-0 w-full bg-background dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-2xl flex flex-col items-center py-8 gap-6 animate-fade-in z-50">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold">Features</a>
            <a href="#enterprise" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold">Enterprise</a>
            <a href="#roadmap" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold">Roadmap</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold">Pricing</a>
            <div className="w-full h-px bg-gray-200 dark:bg-gray-800 my-2"></div>
            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold text-primary">Sign In</Link>
          </div>
        )}
      </nav>

      {/* 2. Hero Section (Stark, B2B Focused, High Contrast) */}
      <section className="relative pt-44 pb-20 lg:pt-56 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[1000px] md:h-[1000px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-20" />
        
        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest border border-primary/20 animate-fade-in">
            <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]"></span>
            The Clinical Standard for Healthcare
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[1.05] animate-slide-up">
            Trust is Built on <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-br from-primary via-blue-500 to-emerald-400">
              Verified Data.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-foreground/60 max-w-3xl mx-auto font-medium leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
            MedBadge transforms clinical portfolios into cryptographic proof of excellence. The single source of truth for elite providers, hospitals, and recruiters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-foreground text-background px-8 py-4 rounded-full text-lg font-black uppercase tracking-wider shadow-2xl hover:scale-105 transition-transform">
              Claim Your Badge <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#enterprise" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-card border-2 border-gray-200 dark:border-gray-800 text-foreground px-8 py-4 rounded-full text-lg font-black uppercase tracking-wider hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
              Book Enterprise Demo
            </Link>
          </div>
        </div>
      </section>

      {/* 2.5 The Clinical Portfolio (Social Selling Visuals) */}
      <section className="py-24 bg-card border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* Visual Phone Mockup */}
            <div className="relative mx-auto w-[320px] h-[640px] bg-card rounded-[3rem] border-[12px] border-primary/20 dark:border-primary/30 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(var(--primary),0.1)] overflow-hidden animate-fade-in hover:scale-105 transition-transform duration-500 ring-4 ring-primary/10">
              <div className="absolute top-0 w-full h-7 bg-primary/20 dark:bg-primary/30 flex justify-center rounded-b-3xl z-10">
                <div className="w-24 h-5 bg-card rounded-b-xl"></div>
              </div>
              <div className="p-6 pt-16 space-y-6">
                <div className="flex flex-col items-center">
                  <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-primary via-blue-500 to-emerald-400 p-1.5 shadow-lg">
                    <div className="w-full h-full bg-card rounded-full border-4 border-background flex items-center justify-center text-5xl">👩‍⚕️</div>
                  </div>
                  <h3 className="mt-5 font-black text-2xl tracking-tight">Sarah Jenkins, RN</h3>
                  <div className="flex text-yellow-400 text-sm mt-1 items-center gap-1">
                    ★★★★★ <span className="text-foreground/50 text-xs font-bold">(124 Recognitions)</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-sm font-black uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5"/> Primary Source Verified
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-5 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative">
                    <div className="absolute -left-2 top-4 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                    <p className="text-sm font-medium leading-relaxed italic text-foreground/80">"Sarah was the most attentive nurse I have ever had. She literally saved my husband's life."</p>
                    <p className="text-xs text-foreground/50 mt-3 font-bold uppercase tracking-wider">- Grateful Patient</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Copy */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-500 text-xs font-black uppercase tracking-widest">
                The Clinical Identity
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">Your Digital Reputation. <br/><span className="text-primary">Beautifully Verified.</span></h2>
              <p className="text-xl text-foreground/60 leading-relaxed font-medium">
                Step away from generic PDFs and black-and-white resumes. MedBadge is your elegant, personalizable portfolio. Showcase your patient testimonials, peer endorsements, and verified credentials in a layout designed to command respect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Horizontal Feature Slider (Mobile Friendly) */}
      <section id="features" className="py-32 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Engineered for Excellence</h2>
            <p className="text-foreground/60 text-xl font-medium">A frictionless ecosystem for providers, patients, and hospitals.</p>
          </div>

          <div className="flex overflow-x-auto pb-8 snap-x snap-mandatory hide-scrollbar md:grid md:grid-cols-3 gap-8">
            <div className="min-w-[320px] w-full snap-center bg-card p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 flex-shrink-0 transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mb-8">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black mb-4">API Verification</h3>
              <p className="text-foreground/60 leading-relaxed font-medium text-lg">
                Direct integration with State Nursing Boards and the NPI Registry guarantees 100% credential authenticity instantly.
              </p>
            </div>

            <div className="min-w-[320px] w-full snap-center bg-card p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 flex-shrink-0 transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-500/10 rounded-3xl flex items-center justify-center mb-8">
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-black mb-4">NFC Smart Badges</h3>
              <p className="text-foreground/60 leading-relaxed font-medium text-lg">
                Physical, premium ID backers embedded with NFC technology. Patients and peers recognize your care with a simple tap.
              </p>
            </div>

            <div className="min-w-[320px] w-full snap-center bg-card p-10 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800 flex-shrink-0 transition-transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-3xl flex items-center justify-center mb-8">
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-black mb-4">Magnet Readiness</h3>
              <p className="text-foreground/60 leading-relaxed font-medium text-lg">
                Hospitals save millions in administrative overhead by exporting perfectly formatted, PSV-cleared ANCC Magnet Status reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "More To Come" Roadmap Teaser (Marketing Flare) */}
      <section id="roadmap" className="py-32 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff1a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff1a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-widest backdrop-blur-md">
              The MedBadge Roadmap
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">More To Come.</h2>
            <p className="text-primary-foreground/80 text-xl font-medium max-w-2xl mx-auto">
              We are constantly evolving to build the ultimate healthcare ecosystem. Here is a sneak peek at what is launching next.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-[2.5rem] hover:bg-white/15 transition-colors">
              <Gift className="w-12 h-12 mb-6 text-yellow-300" />
              <h3 className="text-3xl font-black mb-4">The Gamification Engine</h3>
              <p className="text-primary-foreground/80 text-lg leading-relaxed font-medium">
                Say goodbye to "Review Fatigue". Soon, hitting review milestones (50, 100, 500) will automatically trigger physical rewards—like FIGS gift cards or free coffee—funded directly by our platform. Patients can even "Sponsor a Badge Upgrade" to say thank you without violating Anti-Kickback laws.
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-10 rounded-[2.5rem] hover:bg-white/15 transition-colors">
              <SmartphoneNfc className="w-12 h-12 mb-6 text-emerald-300" />
              <h3 className="text-3xl font-black mb-4">Premium NFC Hardware</h3>
              <p className="text-primary-foreground/80 text-lg leading-relaxed font-medium">
                The software is just the beginning. Our upcoming MedBadge Store will allow Pro users to order highly customized, heavy-duty physical ID backers with embedded NFC chips and scannable QR codes, drop-shipped directly to their door.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Enterprise B2B Section */}
      <section id="enterprise" className="py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-black uppercase tracking-widest">
              B2B Enterprise
            </div>
            <h2 className="text-4xl lg:text-6xl font-black tracking-tight leading-[1.1]">
              Scale Your Agency. <br/>
              <span className="text-primary">Zero Manual HR Checks.</span>
            </h2>
            <p className="text-xl text-foreground/60 leading-relaxed font-medium">
              Recruiters and Chief Nursing Officers waste weeks manually verifying PDF licenses. MedBadge serves up a talent pool of pre-verified, highly-reviewed clinical experts ready for immediate deployment.
            </p>
            <ul className="space-y-6 pt-4">
              {[
                { title: 'Automated Government Registry Pings', desc: 'Instantly verify licenses against state boards.' },
                { title: 'HIPAA-Compliant Review Sanitization', desc: 'AI-driven scrubbers ensure patient privacy.' },
                { title: 'Direct Lead Generation Dashboard', desc: 'Access top-tier talent before they hit the open market.' }
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="text-lg font-bold">{item.title}</h4>
                    <p className="text-foreground/60 font-medium">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="relative">
            <div className="bg-card rounded-[3rem] border border-gray-200 dark:border-gray-800 shadow-2xl p-8 rotate-2 hover:rotate-0 transition-transform duration-700">
              <div className="flex items-center justify-between mb-8 border-b border-gray-100 dark:border-gray-800 pb-6">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-400"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-400"></div>
                  <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
                </div>
                <div className="text-sm font-black text-foreground/40 uppercase tracking-widest">Live Enterprise Analytics</div>
              </div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-background rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800"></div>
                      <div>
                        <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded-md mb-2"></div>
                        <div className="h-4 w-20 bg-primary/20 rounded-md"></div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className="w-4 h-4 text-yellow-400">★</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Pricing Section */}
      <section id="pricing" className="py-32 px-6 bg-card border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">Simple, Transparent Pricing.</h2>
            <p className="text-xl text-foreground/60 font-medium">Invest in your career or scale your healthcare agency.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Standard Tier */}
            <div className="p-10 rounded-[3rem] border border-gray-200 dark:border-gray-800 bg-background shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Standard</h3>
                <div className="mt-4 flex items-baseline text-6xl font-black">
                  $0<span className="text-xl text-foreground/50 font-bold ml-1">/mo</span>
                </div>
                <p className="text-foreground/60 font-medium mt-4">For students and early career professionals.</p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> 3 Verified Reviews per month</li>
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> Basic Portfolio URL</li>
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> Standard App QR Code</li>
                </ul>
              </div>
              <Link href="/login" className="mt-12 block w-full py-4 px-6 bg-gray-100 dark:bg-gray-800 text-center font-black uppercase tracking-wider rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Get Started
              </Link>
            </div>

            {/* Pro Tier */}
            <div className="p-10 rounded-[3rem] border-4 border-primary bg-background shadow-2xl shadow-primary/20 relative transform md:-translate-y-6 flex flex-col justify-between">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">
                The Clinical Standard
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">Pro</h3>
                <div className="mt-4 flex items-baseline text-6xl font-black">
                  $9<span className="text-xl text-foreground/50 font-bold ml-1">/mo</span>
                </div>
                <p className="text-foreground/60 font-medium mt-4">For elite professionals and travel nurses.</p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> Unlimited Reviews</li>
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> Primary Source Verification (PSV)</li>
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> Free Physical NFC Badge Shipped</li>
                </ul>
              </div>
              <Link href="/api/checkout" className="mt-12 block w-full py-4 px-6 bg-primary text-primary-foreground text-center font-black uppercase tracking-wider rounded-2xl hover:scale-105 transition-transform shadow-xl shadow-primary/30">
                Start Free Trial
              </Link>
            </div>

            {/* Enterprise Tier */}
            <div className="p-10 rounded-[3rem] border border-gray-200 dark:border-gray-800 bg-background shadow-sm hover:shadow-xl transition-shadow flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight">Enterprise</h3>
                <div className="mt-4 flex items-baseline text-6xl font-black">
                  Custom
                </div>
                <p className="text-foreground/60 font-medium mt-4">For Hospitals, Agencies, and Facilities.</p>
                <ul className="mt-8 space-y-4">
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> Dedicated API Access</li>
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> Bulk PSV Verification Engine</li>
                  <li className="flex items-center gap-3 font-medium"><CheckCircle2 className="w-5 h-5 text-primary"/> 1-Click Magnet Status Exports</li>
                </ul>
              </div>
              <Link href="mailto:enterprise@medbadge.com" className="mt-12 block w-full py-4 px-6 bg-gray-100 dark:bg-gray-800 text-center font-black uppercase tracking-wider rounded-2xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Global Footer & Legal Disclaimers */}
      <footer className="bg-gray-100 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          
          <div className="space-y-6 max-w-sm">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-2xl shadow-sm overflow-hidden flex items-center justify-center p-2 border border-gray-200">
                <Image src="/logo.png" alt="MedBadge Logo" fill className="object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-2xl tracking-tight leading-none">MedBadge</span>
                <span className="text-primary font-bold text-[10px] tracking-widest uppercase mt-1">Enterprise</span>
              </div>
            </div>
            <p className="text-foreground/60 font-medium leading-relaxed">
              The premier ecosystem for clinical portfolios, peer recognition, and automated credential verification.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 md:gap-24">
            <div className="space-y-4 flex flex-col">
              <h4 className="font-black uppercase tracking-widest text-xs text-foreground/40 mb-2">Platform</h4>
              <a href="#features" className="text-foreground/70 font-medium hover:text-primary transition-colors">Features</a>
              <a href="#pricing" className="text-foreground/70 font-medium hover:text-primary transition-colors">Pricing</a>
              <a href="#roadmap" className="text-foreground/70 font-medium hover:text-primary transition-colors">Roadmap</a>
            </div>
            <div className="space-y-4 flex flex-col">
              <h4 className="font-black uppercase tracking-widest text-xs text-foreground/40 mb-2">Legal</h4>
              <Link href="/privacy" className="text-foreground/70 font-medium hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-foreground/70 font-medium hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-foreground/70 font-medium hover:text-primary transition-colors">HIPAA Compliance</Link>
            </div>
          </div>
        </div>
        
        {/* Legal Disclaimers */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-200 dark:border-gray-800 text-xs text-foreground/40 font-medium leading-relaxed">
          <p className="mb-2">© 2026 MedBadge Inc. All rights reserved.</p>
          <p>
            <strong>Disclaimer:</strong> MedBadge is a professional portfolio and peer-recognition platform. While we utilize Primary Source Verification (PSV) APIs where available, MedBadge does not assume liability for falsified credentials. All non-PSV data is user-submitted. Information contained within MedBadge profiles should not be used as a sole substitute for institutional background checks or official State Board of Nursing/Medical Board verifications.
          </p>
        </div>
      </footer>
      
    </main>
  );
}
