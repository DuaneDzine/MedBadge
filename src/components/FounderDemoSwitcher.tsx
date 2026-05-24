'use client'

import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { ShieldAlert, Users, Building2, User, ChevronUp, ChevronDown } from 'lucide-react'

export default function FounderDemoSwitcher() {
  const { user, demoRole, setDemoRole } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  // Strict Protection: Only render if the email precisely matches the Founder
  if (!user || user.email !== 'djtcma@gmail.com') {
    return null
  }

  const roles = [
    { id: 'b2c_user', label: 'Individual Worker', icon: <User className="w-4 h-4" /> },
    { id: 'b2b_agency', label: 'Staffing Agency', icon: <Users className="w-4 h-4" /> },
    { id: 'b2b_facility', label: 'Hospital Facility', icon: <Building2 className="w-4 h-4" /> },
    { id: 'founder', label: 'System Admin', icon: <ShieldAlert className="w-4 h-4" /> },
  ] as const

  const activeRoleId = demoRole || 'b2c_user'

  return (
    <div className="fixed bottom-4 left-4 z-[9999] animate-fade-in">
      {isOpen ? (
        <div className="bg-gray-900/90 backdrop-blur-xl border border-gray-700 p-4 rounded-3xl shadow-2xl w-[280px] text-white">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-700">
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Founder God-Mode</span>
              <span className="text-[10px] text-gray-400">Instantly switch persona views</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-1 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-2">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => {
                  setDemoRole(r.id as any)
                  setIsOpen(false)
                }}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-sm font-bold ${
                  activeRoleId === r.id 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                    : 'text-gray-300 hover:bg-gray-800 border border-transparent'
                }`}
              >
                {r.icon}
                {r.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-3 bg-gray-900/90 backdrop-blur-md text-emerald-400 border border-gray-700 rounded-full shadow-2xl hover:scale-105 transition-transform"
        >
          <ShieldAlert className="w-5 h-5" />
          <span className="text-xs font-black uppercase tracking-widest">Demo Mode</span>
          <ChevronUp className="w-4 h-4 text-gray-400 ml-1" />
        </button>
      )}
    </div>
  )
}
