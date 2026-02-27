import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
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
  title: `${process.env.COMPANY_NAME || "Cloudflare Banking"} - Banking Services`,
  description: `${process.env.COMPANY_NAME || "Cloudlfare Banking"} banking services and products`,
};

function Header() {
  return (
    <header className="vm-header">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="py-4 px-2">
              <div className="text-[var(--primary)] font-bold text-2xl tracking-tight">{process.env.COMPANY_NAME || "Cloudflare Banking"}</div>
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
            <h3 className="text-lg font-bold mb-4">{process.env.COMPANY_NAME || "Cloudflare Banking"}</h3>
            <p className="text-sm mb-4">© {process.env.COMPANY_NAME || "Cloudflare Banking"} {new Date().getFullYear()}</p>
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
        
        {/* Page Shield Test Scripts - External scripts with various integrity issues */}
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/js/fontawesome.min.js" integrity="sha512-kI12xOdWTh/nL2vIx5Yf3z/kJSmY+nvdTXP2ARhepM/YGcmo/lmRGRttI3Da8FXLDw0Y9hRAyZ5JFO3NrCvvXA==?x=asdas" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cdn.ckeditor.com/4.16.0/standard/ckeditor.js" strategy="afterInteractive" />
        <Script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6?x=asdas" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js?x=asdas" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cf-malicious-test.domain.example/badthing.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://ced-ns.sascdn.com/diff/templates/ts/dist/banner/sas-banner-1.1.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://imgs.signifyd.com/fp/clear3.png;CIS3SID=A1B1472639831C2EA63E92714FC7F5EF" strategy="afterInteractive" />
        <Script src="https://example.com/2023.5.0.js" strategy="afterInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/SyntaxHighlighter/3.0.83/scripts/shBrushJScript.min.js" strategy="afterInteractive" />
        
        {/* Malicious domain test scripts */}
        <Script src="https://malware.testcategory.com/1.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cryptomining.testcategory.com/1.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://malicious.cf-malicious-test.domain.example.com/1.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://another.malicious.cf-malicious-test.domain.example.com/1.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://new3.malicious.cf-malicious-test.domain.example.com/990.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://klarittyjoy.com/test.js" strategy="afterInteractive" />
        <Script src="https://threat.malicious.cf-malicious-test.domain.example.com/1.js" crossOrigin="anonymous" strategy="afterInteractive" />
        
        {/* Malicious URL test scripts */}
        <Script src="https://cf-malicious-test.url.example.com/500.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cf-malicious-test.url.example.com/100.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cf-malicious-test.url.example.com/990.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://cf-malicious-test.url.example.com/new3.js" crossOrigin="anonymous" strategy="afterInteractive" />
        <Script src="https://polinaryapp.com/21ecefdd84a1d2a730.js" crossOrigin="anonymous" strategy="afterInteractive" />
        
        {/* Malicious script examples */}
        <Script src="https://examples.page-shield.workers.dev/0001.js" strategy="afterInteractive" />
        <Script src="https://examples.page-shield.workers.dev/cf-malicious-test-script-new3.js" strategy="afterInteractive" />
        <Script src="https://examples.page-shield.workers.dev/cf-malicious-test-script-new1.js" strategy="afterInteractive" />
        
        {/* Dynamic URL test scripts */}
        <Script src="https://csp-prototype.page-shield.workers.dev/external-script-1.js" strategy="afterInteractive" />
        <Script src="https://csp-prototype.page-shield.workers.dev/external-script-2.js" strategy="afterInteractive" />
        <Script src="https://csp-prototype.page-shield.workers.dev/external-script-3.js" strategy="afterInteractive" />
        
        {/* Large URL script */}
        <Script src="https://examples.page-shield.workers.dev/foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar000bar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001fooboobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar000bar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001foobar0001fooboobar0001foobar0001foobar0001.js" strategy="afterInteractive" />
        
        {/* Other test scripts */}
        <Script src="https://test2.page-shield.workers.dev/x.js" strategy="afterInteractive" />
        <Script src="https://workers.dev/x.js" strategy="afterInteractive" />
        <Script src="https://en.wikipedia.org/x.js" strategy="afterInteractive" />
        <Script src="https://1.1.1.1/site-16bcc13e690cc771698c.js" strategy="afterInteractive" />
        <Script src="https://dash.cloudflare.com/foo.js" strategy="afterInteractive" />
        <Script src="https://blog.cloudflare.com/foo.js" strategy="afterInteractive" />
        <Script src="https://foo.cloudflare.com/foo.js" strategy="afterInteractive" />
        <Script src="https://bing.com/foo.js" strategy="afterInteractive" />
        <Script src="https://baeaweing.com/fadawoo.js" strategy="afterInteractive" />
        <Script src="https://sefjse.com/awdkja.js" strategy="afterInteractive" />
        <Script src="https://bing.co.uk/da.js" strategy="afterInteractive" />
        <Script src="https://baefaweing.com/test.js" strategy="afterInteractive" />
        
        {/* Additional test scripts */}
        <Script src="https://cn.pandora.net/_ws_sbu/sbu_hc.js" strategy="afterInteractive" />
        <Script src="https://global.direct.asda.com/service-worker.js" strategy="afterInteractive" />
        <Script src="https://useinsider.com/wp-includes/js/wp-emoji-release.min.js" strategy="afterInteractive" />
        <Script src="https://otvetstvennayaigra.betfair.com/wp-includes/js/twemoji.js" strategy="afterInteractive" />
        <Script src="https://static.atgsvcs.com/js/atgsvcs.js" strategy="afterInteractive" />
        <Script src="https://cdn.sub2tech.com/CodeBase/LIVE/Min/sub2.js" strategy="afterInteractive" />
        <Script src="https://assets.api.useinsider.com/js/opt-in-popup-helper.js" strategy="afterInteractive" />
        <Script src="https://www.americantourister.co.kr/on/demandware.static/Sites-AmericanTouristerKR-Site/-/ko_KR/v1665602114344/js/kakaoStoreLocator.js" strategy="afterInteractive" />
        
        {/* CSP Violation Reporter - captures and reports violations to Page Shield */}
        <Script id="csp-violation-reporter" strategy="afterInteractive">
          {`
            let url = "";
            document.addEventListener("securitypolicyviolation", (e) => {
              console.log(e.disposition);
              let policy = e.originalPolicy;
              let pparse = policy.split(';');
              pparse.forEach(searchAndStore);
              let body = JSON.stringify({
                "csp-report": {
                  "blocked-uri": e.blockedURI,
                  "disposition": e.disposition,
                  "document-uri": e.documentURI,
                  "effective-directive": e.effectiveDirective,
                  "original-policy": e.originalPolicy,
                  "referrer": e.referrer,
                  "status-code": e.statusCode,
                  "violated-directive": e.violatedDirective
                }
              });
              console.log(body);
              if (url !== "" && !url.includes(e.blockedURI) && !(e.blockedURI.includes('/cdn-cgi/') || e.blockedURI.includes('csp-reporting.cloudflare.com'))) {
                fetch(url, {
                  method: "POST",
                  headers: { "Content-Type": "application/csp-report" },
                  body: body
                });
              }
            });
            function searchAndStore(item) {
              if (item.includes("report-uri")) {
                let parse = item.split(' ');
                url = parse[2];
              }
            }
          `}
        </Script>
        
        {/* Connection test script - triggers outbound connections for Page Shield detection */}
        {/* Uses multiple methods: sendBeacon (no CORS), fetch (no-cors mode), and image pixels */}
        <Script id="connection-test" strategy="afterInteractive">
          {`
            function init_connection() {
              // Test URLs for Page Shield connection monitoring
              var testUrls = [
                "https://hookb.in/nP7QwexB8BhZVG2ZLa0Y",
                "https://example.com/foo",
                "https://hookb.in/barQwexB8BhZVG2ZLa0Y",
                "https://hookb.in/connectionPath2023",
                "https://hookb.in/connectionPath2?a=1",
                "https://cf-malicious-test.domain.example.com/foo",
                "https://cf-malicious-test.domain.example.com"
              ];
              
              testUrls.forEach(function(url) {
                // Method 1: navigator.sendBeacon (fire-and-forget, often bypasses CORS)
                try {
                  if (navigator.sendBeacon) {
                    navigator.sendBeacon(url, JSON.stringify({ test: "page-shield" }));
                    console.log("sendBeacon sent to: " + url);
                  }
                } catch(e) {
                  console.log("sendBeacon failed for: " + url);
                }
                
                // Method 2: fetch with no-cors mode (request goes out, can't read response)
                try {
                  fetch(url, {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify({ test: "page-shield" })
                  }).then(function() {
                    console.log("fetch (no-cors) sent to: " + url);
                  }).catch(function() {
                    console.log("fetch (no-cors) failed for: " + url);
                  });
                } catch(e) {
                  console.log("fetch failed for: " + url);
                }
                
                // Method 3: Image pixel (always works for GET requests)
                try {
                  var img = new Image();
                  img.src = url + (url.includes("?") ? "&" : "?") + "px=1&t=" + Date.now();
                  console.log("image pixel sent to: " + url);
                } catch(e) {
                  console.log("image pixel failed for: " + url);
                }
              });
              
              console.log("Page Shield test: sent all connections");
            }
            
            // Run on page load
            if (document.readyState === "complete" || document.readyState === "interactive") {
              setTimeout(init_connection, 100);
            } else {
              document.addEventListener("DOMContentLoaded", init_connection);
            }
          `}
        </Script>
      </body>
    </html>
  );
}
