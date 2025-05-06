import Link from 'next/link';

export default function Challenge() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="vm-card">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-[var(--secondary)] mt-4">Security Challenge</h1>
            <p className="text-gray-600 mt-2">
              Please complete the challenge below to continue.
            </p>
          </div>
          
          <div className="bg-[var(--vm-light-gray)] p-4 rounded-md mb-6 flex justify-center">
            {/* CAPTCHA placeholder */}
            ::CAPTCHA_BOX::
          </div>
          
          <div className="flex flex-col space-y-4">
            <Link href="/" className="vm-button text-center">
              Return to Home
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need help? <Link href="/contact" className="text-[var(--primary)] hover:underline">Get in touch with our team</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
