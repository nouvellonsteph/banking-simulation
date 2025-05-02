import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="bg-[var(--primary)] text-white rounded-lg p-8 md:p-12 mb-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to {process.env.COMPANY_NAME || "Virgin Money"}</h1>
          <p className="text-lg mb-6">Banking that makes a difference. Simple, transparent, and designed for you.</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/login" className="vm-button">
              Log In to Online Banking
            </Link>
            <Link href="/contact" className="vm-button-secondary">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Banking Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="vm-card">
            <h3 className="text-xl font-bold mb-3 text-[var(--primary)]">Personal Banking</h3>
            <p className="mb-4">Manage your money with our user-friendly digital banking platform. Access your accounts anytime, anywhere.</p>
            <Link href="#" className="text-[var(--primary)] font-semibold hover:underline">
              Learn more →
            </Link>
          </div>
          <div className="vm-card">
            <h3 className="text-xl font-bold mb-3 text-[var(--primary)]">Mortgages</h3>
            <p className="mb-4">Find the right mortgage for your needs with competitive rates and flexible repayment options.</p>
            <Link href="#" className="text-[var(--primary)] font-semibold hover:underline">
              Learn more →
            </Link>
          </div>
          <div className="vm-card">
            <h3 className="text-xl font-bold mb-3 text-[var(--primary)]">Credit Cards</h3>
            <p className="mb-4">Discover our range of credit cards with rewards, cashback, and exclusive benefits.</p>
            <Link href="#" className="text-[var(--primary)] font-semibold hover:underline">
              Learn more →
            </Link>
          </div>
        </div>
      </section>

      {/* API Demo Section */}
      <section className="mb-12">
        <div className="vm-card">
          <h2 className="text-2xl font-bold mb-4 text-[var(--primary)]">Developer Resources</h2>
          <p className="mb-6">Explore our API documentation and test our endpoints in the demo section.</p>
          <Link href="/api-demo" className="vm-button inline-block">
            Try API Demo
          </Link>
        </div>
      </section>

      {/* Security Notice */}
      <section>
        <div className="bg-[var(--vm-light-gray)] rounded-lg p-6 border-l-4 border-[var(--primary)]">
          <h3 className="text-lg font-bold mb-2">Security Notice</h3>
          <p>This is a demo application for security testing purposes. Please do not enter real personal or financial information.</p>
        </div>
      </section>
    </div>
  );
}
