"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Turnstile from "react-turnstile";

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [turnstileEnabled, setTurnstileEnabled] = useState(false);

  // Check for turnstile parameter in URL on component mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const turnstileParam = params.get("turnstile");
    setTurnstileEnabled(turnstileParam === "true");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validate turnstile if enabled
    if (turnstileEnabled && !token) {
      setError("Please complete the Turnstile challenge");
      setLoading(false);
      return;
    }

    try {
      // Send data to the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          token: turnstileEnabled ? token : null,
          turnstileEnabled,
        }),
      });

      const data = await response.json() as { success?: boolean; error?: string };
      
      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }
      
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while submitting the form. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form to allow submitting another message
  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
    setSubmitted(false);
    setToken(null);
  };

  // Render success message if form was submitted
  if (submitted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-lg mx-auto">
          <div className="vm-card">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4 text-[var(--primary)]">Message Sent!</h1>
              <p className="mb-6">Thank you for contacting Virgin Money. We&#39;ll get back to you as soon as possible.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleReset} className="vm-button">
                  Send Another Message
                </button>
                <Link href="/" className="vm-button-secondary">
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-lg mx-auto">
        <div className="vm-card">
          <h1 className="text-2xl font-bold mb-6 text-[var(--primary)]">Contact Us</h1>
          
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
              <p className="text-red-700">{error}</p>
            </div>
          )}
          
          {turnstileEnabled && (
            <div className="mb-6 p-4 bg-[var(--vm-light-gray)] rounded-lg">
              <p className="text-sm mb-4">Security verification is required. Please complete the challenge below.</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="vm-label">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="vm-input"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="email" className="vm-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="vm-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="phone" className="vm-label">
                Phone (optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="vm-input"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="message" className="vm-label">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="vm-input"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            
            {turnstileEnabled && (
              <div className="mb-6 flex justify-center">
                <Turnstile
                  sitekey={process.env.TURNSTILE_SITE_KEY || ""}
                  onVerify={(token) => setToken(token)}
                  theme="light"
                />
              </div>
            )}
            
            <button
              type="submit"
              className="vm-button w-full"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h2 className="text-lg font-bold mb-4">Other ways to contact us</h2>
            <div className="space-y-3">
              <p>
                <strong>Phone:</strong> 0800 123 4567
              </p>
              <p>
                <strong>Email:</strong> support@virginmoney.example
              </p>
              <p>
                <strong>Address:</strong><br />
                Virgin Money<br />
                Jubilee House<br />
                Gosforth, Newcastle upon Tyne<br />
                NE3 4PL
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[var(--primary)] hover:underline">
            ← Back to Home
          </Link>
        </div>

        {!turnstileEnabled ? (
          <div className="mt-6 text-center">
            <Link 
              href="/contact?turnstile=true" 
              className="text-sm text-gray-500 hover:underline"
            >
              Switch to protected form
            </Link>
          </div>
        ) : (
          <div className="mt-6 text-center">
            <Link 
              href="/contact" 
              className="text-sm text-gray-500 hover:underline"
            >
              Switch to standard form
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
