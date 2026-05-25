'use client'

import { QRCodeCanvas } from 'qrcode.react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'

interface QRCodeGeneratorProps {
  userId: string;
}

export default function QRCodeGenerator({ userId }: QRCodeGeneratorProps) {
  const [baseUrl, setBaseUrl] = useState('https://medbadge.io');
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  const profileUrl = `${baseUrl}/${userId}`;
  const qrFgColor = resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a';

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-card text-card-foreground rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 max-w-sm mx-auto animate-fade-in print-only">
      <h2 className="text-xl font-bold mb-2">Your Smart Badge</h2>
      <p className="text-sm text-foreground/70 mb-6 text-center no-print">
        Colleagues can scan this code to leave a verified, five-star review instantly.
      </p>
      
      <div className="p-4 bg-background rounded-xl mb-6 shadow-inner">
        <QRCodeCanvas 
          value={profileUrl} 
          size={200}
          level={"H"}
          includeMargin={true}
          fgColor={qrFgColor}
          bgColor="transparent"
        />
      </div>
      
      <button 
        onClick={() => window.print()}
        className="w-full py-3 px-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-colors shadow-sm no-print"
      >
        Print Badge
      </button>
      
      <div className="mt-4 text-xs text-foreground/50 text-center truncate w-full px-2">
        Custom URL: <span className="font-medium text-foreground">{profileUrl}</span>
      </div>
    </div>
  )
}
