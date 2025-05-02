import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: `${process.env.COMPANY_NAME || "Virgin Money"} - Banking Services`,
  description: `${process.env.COMPANY_NAME || "Virgin Money"} banking services and products`,
};

function Header() {
  return (
    <header className="vm-header">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="py-4 px-2">
              <div className="text-[var(--primary)] font-bold text-2xl tracking-tight">{process.env.COMPANY_NAME || "Virgin Money"}</div>
            </div>
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <Link href="/" className="font-medium hover:text-[var(--primary)]">Home</Link>
          <Link href="/login" className="font-medium hover:text-[var(--primary)]">Login</Link>
          <Link href="/contact" className="font-medium hover:text-[var(--primary)]">Contact</Link>
          <Link href="/api-demo" className="font-medium hover:text-[var(--primary)]">API Demo</Link>
          <Link href="/api-docs" className="font-medium hover:text-[var(--primary)]">API Docs</Link>
        </nav>
        <div className="md:hidden">
          <button className="text-[var(--primary)] font-bold">Menu</button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="vm-footer mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{process.env.COMPANY_NAME || "Virgin Money"}</h3>
            <p className="text-sm mb-4">© {process.env.COMPANY_NAME || "Virgin Money"} {new Date().getFullYear()}</p>
            <p className="text-sm">This is a demo application for security testing purposes only.</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:underline">Current Accounts</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Savings</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Mortgages</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Credit Cards</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:underline">Help Center</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Contact Us</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Security</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Report an Issue</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="#" className="text-sm hover:underline">Privacy Policy</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Terms of Service</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Cookies</Link></li>
              <li><Link href="#" className="text-sm hover:underline">Accessibility</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get primary color from environment variable or use default
  const primaryColor = process.env.COLOR_PRIMARY || "#e10718";
  
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --primary: ${primaryColor};
          }
          
          @media (prefers-color-scheme: dark) {
            :root {
              --primary: ${primaryColor};
            }
          }
        `}</style>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased min-h-screen flex flex-col bg-white`}
      >
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
