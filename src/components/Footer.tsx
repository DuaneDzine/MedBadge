import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="w-full bg-background border-t border-gray-100 dark:border-gray-800 py-12 px-6 mt-16">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-8">
        
        {/* Branding & Contact */}
        <div className="text-center md:text-left space-y-2">
          <div className="flex items-center justify-center md:justify-start gap-2 font-bold text-xl text-foreground">
            <div className="w-6 h-6 bg-primary rounded-md"></div>
            MedBadge
          </div>
          <p className="text-sm text-foreground/60 max-w-xs">
            The verifiable professional identity layer for healthcare.
          </p>
          <a href="mailto:support@medbadge.app" className="text-sm font-medium text-primary hover:underline inline-block mt-2">
            support@medbadge.app
          </a>
        </div>

        {/* Compliance Boilerplate */}
        <div className="text-center md:text-left space-y-4 max-w-md">
          <h4 className="text-sm font-bold text-foreground">HIPAA & Security Statement</h4>
          <p className="text-xs text-foreground/60 leading-relaxed">
            MedBadge employs AES-256 encryption at rest and TLS 1.3 in transit to ensure strict compliance with HIPAA data security standards. Your data is never sold or shared without explicit authorization.
          </p>
        </div>

        {/* Links */}
        <div className="flex flex-col text-center md:text-right gap-2">
          <h4 className="text-sm font-bold text-foreground">Legal</h4>
          <Link href="/privacy" className="text-xs text-foreground/60 hover:text-primary transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="text-xs text-foreground/60 hover:text-primary transition-colors">Terms & Conditions</Link>
          <span className="text-[10px] text-foreground/40 mt-4">
            © {new Date().getFullYear()} MedBadge Inc. All rights reserved.
          </span>
        </div>

      </div>
    </footer>
  )
}
