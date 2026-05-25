export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-background p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-4xl font-black">Terms of Service</h1>
        <p className="text-foreground/70">
          Last Updated: {new Date().toLocaleDateString()}
        </p>
        <div className="prose dark:prose-invert">
          <p>
            Welcome to MedBadge. By using our platform, you agree to these terms.
            MedBadge is a professional portfolio and peer-recognition platform. 
            We are not liable for user-submitted data.
          </p>
        </div>
      </div>
    </div>
  );
}
