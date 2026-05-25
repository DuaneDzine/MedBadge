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
import { doc, updateDoc, setDoc, collection, addDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Users, ShieldCheck, Download, AlertTriangle, CheckCircle, Activity, FileText } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, loading, demoRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeRole = demoRole || profile?.role_type || 'b2c_user';

  if (activeRole === 'b2b_agency') return <AgencyDashboard />;
  if (activeRole === 'b2b_facility') return <FacilityDashboard />;
  
  return <IndividualDashboard />;
}

function AgencyDashboard() {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const mockTravelers = [
    { id: 1, name: "Sarah Jenkins", specialty: "ICU RN", status: "Compliant", color: "text-green-600 bg-green-100 dark:bg-green-900/30", action: "None" },
    { id: 2, name: "Marcus Reed", specialty: "ER RN", status: "Expiring Soon", color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30", action: "Renew BLS" },
    { id: 3, name: "Elena Rostova", specialty: "MedSurg", status: "Non-Compliant", color: "text-red-600 bg-red-100 dark:bg-red-900/30", action: "Missing License" },
    { id: 4, name: "David Chen", specialty: "CRNA", status: "Compliant", color: "text-green-600 bg-green-100 dark:bg-green-900/30", action: "None" },
  ];

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-fade-in transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground">Aya Healthcare Portal</h1>
            <p className="text-primary font-medium text-sm mt-1">B2B Staffing Agency Demo</p>
          </div>
          <div className="flex items-center gap-4">
             <ThemeToggle />
             <button onClick={handleSignOut} className="text-sm font-medium text-foreground/50 hover:text-foreground">Sign Out</button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Roster</p>
                <h3 className="text-4xl font-bold mt-2">142</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Users className="w-6 h-6" /></div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Network Compliance</p>
                <h3 className="text-4xl font-bold mt-2 text-green-500">94%</h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><ShieldCheck className="w-6 h-6" /></div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Pending Actions</p>
                <h3 className="text-4xl font-bold mt-2 text-yellow-500">12</h3>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-xl text-yellow-500"><AlertTriangle className="w-6 h-6" /></div>
            </div>
          </div>
        </div>

        <section className="bg-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-foreground">Traveler Roster</h2>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-colors shadow-sm">
              <Download className="w-4 h-4" /> Export JCAHO Roster
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 text-sm">
                <tr>
                  <th className="p-4 font-semibold">Provider Name</th>
                  <th className="p-4 font-semibold">Specialty</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Next Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {mockTravelers.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                    <td className="p-4 font-bold text-foreground">{t.name}</td>
                    <td className="p-4 text-foreground/70 font-medium">{t.specialty}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.color}`}>{t.status}</span>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground/70">{t.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

function FacilityDashboard() {
  const { signOut } = useAuth();
  const router = useRouter();
  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  const handleDownloadMagnetReport = () => {
    const reportContent = "MEDBADGE MAGNET COMPLIANCE REPORT\nFacility: Cedars-Sinai Portal\nDate: " + new Date().toLocaleDateString() + "\n\n--- Unit Compliance ---\nICU: 98% (Compliant)\nER: 85% (Warning: 3 ACLS Expiring)\nMedSurg: 100% (Compliant)\n\n--- Quality Metrics ---\nOverall Patient Safety Score: 4.8/5.0\nTotal Active Agency Staff: 45\n\nSignature: ______________________";
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'MAGNET_Approval_Report.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 animate-fade-in transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground">Cedars-Sinai Portal</h1>
            <p className="text-primary font-medium text-sm mt-1">Facility Compliance & Magnet Demo</p>
          </div>
          <div className="flex items-center gap-4">
             <ThemeToggle />
             <button onClick={handleSignOut} className="text-sm font-medium text-foreground/50 hover:text-foreground">Sign Out</button>
          </div>
        </header>

        <div className="flex justify-end">
           <button onClick={handleDownloadMagnetReport} className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 border-2 border-primary/20">
              <FileText className="w-5 h-5" /> Download MAGNET Approval Packet
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Patient Safety Score</p>
                <h3 className="text-4xl font-bold mt-2 text-green-500">4.8 <span className="text-lg text-gray-400">/ 5.0</span></h3>
              </div>
              <div className="p-3 bg-green-500/10 rounded-xl text-green-500"><CheckCircle className="w-6 h-6" /></div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Facility Compliance</p>
                <h3 className="text-4xl font-bold mt-2 text-primary">94.3%</h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl text-primary"><Activity className="w-6 h-6" /></div>
            </div>
          </div>
          <div className="bg-card p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active Agency Staff</p>
                <h3 className="text-4xl font-bold mt-2">45</h3>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-foreground"><Users className="w-6 h-6" /></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-card rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-foreground">Unit Compliance Tracker</h2>
            </div>
            <div className="p-8 space-y-8">
               <div>
                 <div className="flex justify-between mb-3"><span className="font-bold text-lg">ICU (Intensive Care)</span><span className="text-green-500 font-black text-lg">98%</span></div>
                 <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4"><div className="bg-green-500 h-4 rounded-full" style={{width: '98%'}}></div></div>
               </div>
               <div>
                 <div className="flex justify-between mb-3"><span className="font-bold text-lg">ER (Emergency)</span><span className="text-yellow-500 font-black text-lg">85%</span></div>
                 <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4"><div className="bg-yellow-500 h-4 rounded-full" style={{width: '85%'}}></div></div>
               </div>
               <div>
                 <div className="flex justify-between mb-3"><span className="font-bold text-lg">MedSurg</span><span className="text-primary font-black text-lg">100%</span></div>
                 <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-4"><div className="bg-primary h-4 rounded-full" style={{width: '100%'}}></div></div>
               </div>
            </div>
          </section>
          
          <section className="bg-yellow-50 dark:bg-yellow-900/10 rounded-3xl shadow-sm border border-yellow-200 dark:border-yellow-900/50 overflow-hidden">
             <div className="p-6 border-b border-yellow-200 dark:border-yellow-900/50 flex gap-2 items-center text-yellow-700 dark:text-yellow-500 bg-yellow-100/50 dark:bg-transparent">
                <AlertTriangle className="w-6 h-6" />
                <h2 className="text-lg font-bold">Compliance Alerts</h2>
             </div>
             <div className="p-6 space-y-4">
                <div className="p-4 bg-white dark:bg-card border border-yellow-300 dark:border-yellow-800 rounded-xl shadow-sm">
                   <p className="text-sm font-bold text-foreground">ER Unit Warning</p>
                   <p className="text-xs text-foreground/70 mt-2 leading-relaxed">3 ACLS Certifications expiring within 30 days. Magnet status at risk.</p>
                </div>
                <div className="p-4 bg-white dark:bg-card border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm">
                   <p className="text-sm font-bold text-foreground">New Roster Addition</p>
                   <p className="text-xs text-foreground/70 mt-2 leading-relaxed">David Chen (CRNA) successfully verified via Primary Source.</p>
                </div>
             </div>
          </section>
        </div>

      </div>
    </div>
  );
}

function IndividualDashboard() {
  const router = useRouter();
  const { user, profile, loading, signOut } = useAuth();
  
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

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };
  
  // Toggles the visibility state in Firestore
  const handlePrivacyToggle = async () => {
    const newVisibility = !isPrivate;
    setIsPrivate(newVisibility)
    await updateDoc(doc(db, 'users', userId), { visibility: newVisibility ? 'private' : 'public' })
  }

  const handleSaveIdentity = async () => {
    setIsSavingIdentity(true)
    try {
      await setDoc(doc(db, 'users', userId), {
        firstName,
        lastName,
        clinicalTitle,
        primarySpecialty,
        stateOfLicensure,
        npiNumber,
        displayName: `${firstName} ${lastName}`.trim() || profile?.displayName || ''
      }, { merge: true })
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
      
      const newCredential = {
        fileName: file.name,
        fileUrl: downloadURL,
        expirationDate: new Date(expirationDate).getTime(),
        type: 'Credential',
        status: 'Self-Reported',
        uploadedAt: Date.now()
      };
      
      await updateDoc(doc(db, 'users', userId), {
        credentials: arrayUnion(newCredential)
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
             <button onClick={handleSignOut} className="text-sm text-foreground/50 hover:text-foreground">Sign Out</button>
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
