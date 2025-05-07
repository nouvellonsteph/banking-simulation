
"use client";
import { useState, useEffect } from "react";
import type { User } from "../api/login/route";
import Link from "next/link";
import Turnstile from "react-turnstile";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY;

  // Check for turnstile parameter in URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const turnstileParam = params.get("turnstile");
    setTurnstileEnabled(turnstileParam === "true");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate turnstile if enabled
    if (turnstileEnabled && !token) {
      setError("Please complete the security verification");
      setLoading(false);
      return;
    }

    try {
      // Call the login API endpoint
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
          token,
          turnstileEnabled,
        }),
      });

      const data = await response.json() as { success?: boolean; error?: string; user?: User };
      
      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }
      
      if (data.success) {
        // In a real app, you might store the user data in context or localStorage
        // For this demo, we'll just redirect to the home page
        window.location.href = "/";
      } else {
        throw new Error('Authentication failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <div className="vm-card">
          <h1 className="text-2xl font-bold mb-6 text-[var(--primary)]">Log In to Online Banking</h1>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700 font-medium">Demo Accounts</p>
            <ul className="text-sm text-blue-700 mt-1">
              <li><strong>Regular User:</strong> username: &quot;demo_user&quot;, password: &quot;password123&quot;</li>
              <li><strong>Premium User:</strong> username: &quot;premium_user&quot;, password: &quot;password123&quot;</li>
              <li><strong>Admin User:</strong> username: &quot;admin_user&quot;, password: &quot;password123&quot;</li>
            </ul>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="username" className="vm-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="vm-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="demo_user"
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="vm-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="vm-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="password123"
              />
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="mr-2"
                />
                <label htmlFor="remember" className="text-sm">
                  Remember me
                </label>
              </div>
              
              <Link href="#" className="text-sm text-[var(--primary)] hover:underline">
                Forgot password?
              </Link>
            </div>
            
            {turnstileEnabled && (
              <div className="mb-6 flex justify-center">
                <Turnstile
                  sitekey={turnstileSiteKey || "0x4AAAAAABXgDOr9knna9nPt"}
                  onVerify={(token: string) => setToken(token)}
                  theme="light"
                />
              </div>
            )}
            
            <button
              type="submit"
              className="vm-button w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm">
              Don&apos;t have an account?{" "}
              <Link href="#" className="text-[var(--primary)] hover:underline">
                Register now
              </Link>
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[var(--primary)] hover:underline">
            ← Back to Home
          </Link>
        </div>
        
        {/* Toggle security feature */}
        <div className="mt-2 text-center">
          {turnstileEnabled ? (
            <Link 
              href="/login" 
              className="text-sm text-gray-500 hover:underline"
            >
              Switch to standard login
            </Link>
          ) : (
            <Link 
              href="/login?turnstile=true" 
              className="text-sm text-gray-500 hover:underline"
            >
              Switch to enhanced security login
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
