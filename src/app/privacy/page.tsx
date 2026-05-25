export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-black">Privacy Policy</h1>
        <p className="text-foreground/70">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
        <div className="prose dark:prose-invert">
          <p>
            MedBadge respects your privacy. All information uploaded is securely processed and 
            we employ AES-256 encryption at rest to ensure compliance with HIPAA data security standards.
          </p>
        </div>
      </div>
    </div>
  );
}
