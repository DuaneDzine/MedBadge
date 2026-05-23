'use client'

import React, { useState, useEffect } from 'react';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, updateDoc, collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function Dashboard() {
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  
  useEffect(() => {
    // Auth Lock
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const [isPrivate, setIsPrivate] = useState(profile?.visibility === 'private' || false)
  const [uploadStatus, setUploadStatus] = useState<string | null>(null)
  const [expirationDate, setExpirationDate] = useState('')
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { setTheme } = useTheme();

  // Identity State (Mock Data for Demo)
  const [firstName, setFirstName] = useState(profile?.firstName || 'Sarah')
  const [lastName, setLastName] = useState(profile?.lastName || 'Jenkins')
  const [clinicalTitle, setClinicalTitle] = useState(profile?.clinicalTitle || 'RN, BSN')
  const [primarySpecialty, setPrimarySpecialty] = useState(profile?.primarySpecialty || 'Intensive Care')
  const [stateOfLicensure, setStateOfLicensure] = useState(profile?.stateOfLicensure || 'California')
  const [npiNumber, setNpiNumber] = useState(profile?.npiNumber || '1098765432')
  const [isSavingIdentity, setIsSavingIdentity] = useState(false)
  
  useEffect(() => {
    if (profile) {
      setIsPrivate(profile.visibility === 'private')
      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setClinicalTitle(profile.clinicalTitle || '')
      setPrimarySpecialty(profile.primarySpecialty || '')
      setStateOfLicensure(profile.stateOfLicensure || '')
      setNpiNumber(profile.npiNumber || '')
    }
  }, [profile])

  // Auth Lock
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const userId = user.uid;
  const mockUserId = userId;
  
  // Toggles the visibility state in Firestore
  const handlePrivacyToggle = async () => {
    const newVisibility = !isPrivate;
    setIsPrivate(newVisibility)
    await updateDoc(doc(db, 'users', userId), { visibility: newVisibility ? 'private' : 'public' })
  }

  const handleSaveIdentity = async () => {
    setIsSavingIdentity(true)
    try {
      await updateDoc(doc(db, 'users', userId), {
        firstName,
        lastName,
        clinicalTitle,
        primarySpecialty,
        stateOfLicensure,
        npiNumber,
        displayName: `${firstName} ${lastName}`.trim() || profile?.displayName || ''
      })
      alert("Identity saved successfully!")
    } catch (error) {
      alert("Failed to save identity.")
    }
    setIsSavingIdentity(false)
  }

  const handleColorChange = (color: string) => {
    if (color === 'blue') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', color);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!expirationDate) {
      setUploadStatus('Error: Please select an expiration date first.');
      return;
    }
    
    try {
      setUploadStatus(`Uploading ${file.name}...`);
      const fileRef = ref(storage, `users/${userId}/credentials/${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadURL = await getDownloadURL(fileRef);
      
      await addDoc(collection(db, 'users', userId, 'credentials'), {
        fileName: file.name,
        fileUrl: downloadURL,
        expirationDate: new Date(expirationDate).getTime(),
        type: 'Credential',
        visibility: 'private',
        status: 'Self-Reported',
        uploadedAt: Date.now()
      });
      
      setUploadStatus('Upload complete! Status: Self-Reported');
    } catch (error: any) {
      setUploadStatus(`Upload failed: ${error.message}`);
    }
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto space-y-8 animate-slide-up">
        
        {/* Header & Branding */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 p-2 hover:scale-105 transition-transform">
              <Image src="/logo.png" alt="MedBadge Logo" fill className="object-contain" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-3xl font-black text-foreground tracking-tight leading-none">Dashboard</h1>
              <span className="text-primary font-bold text-[10px] tracking-widest uppercase mt-1">Enterprise Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <ThemeToggle />
             <button onClick={() => {}} className="text-sm text-foreground/50 hover:text-foreground">Sign Out</button>
          </div>
        </header>

        {/* Phase 4: MySpace Personalization */}
        <section className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          <h2 className="text-xl font-semibold text-foreground border-b border-gray-100 dark:border-gray-800 pb-4">Profile Customization</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-foreground mb-2">Visual Theme</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Choose a color palette for your public profile.</p>
              <div className="flex gap-3">
                <button onClick={() => handleColorChange('blue')} className="w-10 h-10 rounded-full bg-blue-500 ring-2 ring-offset-2 ring-transparent focus:ring-blue-500 transition-all shadow-sm" aria-label="Clinical Blue"></button>
                <button onClick={() => handleColorChange('pink')} className="w-10 h-10 rounded-full bg-pink-500 ring-2 ring-offset-2 ring-transparent focus:ring-pink-500 transition-all shadow-sm" aria-label="Vibrant Pink"></button>
                <button onClick={() => handleColorChange('green')} className="w-10 h-10 rounded-full bg-green-500 ring-2 ring-offset-2 ring-transparent focus:ring-green-500 transition-all shadow-sm" aria-label="Eco Green"></button>
              </div>
            </div>
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Your Metrics</h2>
              <p className="text-sm text-gray-500">Verified performance data</p>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              Pro Tier Eligible
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <span className="block text-3xl font-bold text-gray-900">{profile?.metrics?.averageRating || "5.0"}</span>
              <span className="block text-sm text-gray-500 mt-1">Average Rating</span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <span className="block text-3xl font-bold text-gray-900">{profile?.metrics?.totalReviews || 0}</span>
              <span className="block text-sm text-gray-500 mt-1">Verified Reviews</span>
            </div>
          </div>
        </section>

        {/* Phase 5: Professional Identity Management */}
        <section className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground border-b border-gray-100 dark:border-gray-800 pb-4">Professional Identity</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Duane" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Johnson" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Clinical Title</label>
              <input type="text" value={clinicalTitle} onChange={(e) => setClinicalTitle(e.target.value)} placeholder="e.g. RN, MD, DO" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Specialty</label>
              <input type="text" value={primarySpecialty} onChange={(e) => setPrimarySpecialty(e.target.value)} placeholder="e.g. ICU, Pediatrics" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State of Licensure</label>
              <input type="text" value={stateOfLicensure} onChange={(e) => setStateOfLicensure(e.target.value)} placeholder="e.g. Texas" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">NPI Number (Optional)</label>
              <input type="text" value={npiNumber} onChange={(e) => setNpiNumber(e.target.value)} placeholder="10-digit National Provider Identifier" className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-transparent text-foreground focus:ring-2 focus:ring-primary outline-none" />
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button onClick={handleSaveIdentity} disabled={isSavingIdentity} className="py-2 px-6 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
              {isSavingIdentity ? 'Saving...' : 'Save Identity'}
            </button>
          </div>
        </section>

        {/* Privacy & Credentials Vault Section */}
        <section className="bg-white dark:bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-foreground border-b border-gray-100 dark:border-gray-800 pb-4">Privacy & Credentials Vault</h2>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-foreground">Profile Visibility</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isPrivate 
                  ? "Private. Employers must be granted access via Secure Share Link." 
                  : "Public. Anyone with your link can view your profile."}
              </p>
            </div>
            <button 
              onClick={handlePrivacyToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${isPrivate ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
            <h3 className="font-medium text-gray-900 dark:text-foreground mb-2">Upload Credentials</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Securely store licenses and certificates. Uploads are marked as 'Self-Reported' until Primary Source Verified.
            </p>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <label className="cursor-pointer bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-foreground py-2 px-4 rounded-xl text-sm font-medium transition-colors">
                Select Document (PDF/Image)
                <input type="file" className="hidden" accept=".pdf,image/*" onChange={handleFileUpload} />
              </label>
              
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground/80">Expiration Date:</span>
                <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="p-2 bg-background border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-2 focus:ring-primary outline-none text-foreground" />
              </div>

              {uploadStatus && <span className="text-sm text-green-600 font-medium">{uploadStatus}</span>}
            </div>
            
            {/* Expiration Warning Widget Placeholder */}
            <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-400">
                Action Required: You have 1 credential expiring in the next 90 days.
              </p>
            </div>
          </div>
        </section>

        {/* Phase 3: Advanced Security & Compliance */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-4 text-red-600">Advanced Security & Compliance</h2>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Multi-Factor Authentication (MFA)</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Secure your account with 2FA. Mandatory for Recruiter and Admin roles to comply with strict B2B access standards.
              </p>
            </div>
            <button className="py-2 px-4 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition-colors shrink-0">
              Enroll in MFA
            </button>
          </div>

          <div className="pt-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-medium text-gray-900">Data Portability & Deletion (GDPR/CCPA)</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Export your telemetry data or permanently delete your MedBadge account. This action is irreversible.
              </p>
            </div>
            <button className="py-2 px-4 border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors shrink-0">
              Delete Account
            </button>
          </div>
        </section>

        {/* Smart Badge Section */}
        <section>
          <QRCodeGenerator userId={mockUserId} />
        </section>

      </div>

      {/* Phase 10: AI Customer Support Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform border-4 border-background"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        </button>
      </div>

    </main>
  )
}
