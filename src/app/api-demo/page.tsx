"use client";

import { useState } from "react";
import Link from "next/link";

interface ApiResponse {
  method: string;
  endpoint: string;
  data: unknown;
  timestamp: string;
}

export default function ApiDemo() {
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState("/api/accounts");
  const [selectedMethod, setSelectedMethod] = useState("GET");
  const [useApiKey, setUseApiKey] = useState(true);
  const [apiKey, setApiKey] = useState("vm-api-demo-key-123456"); // Default valid API key
  const [requestBody, setRequestBody] = useState(
    JSON.stringify({ amount: 100, description: "Sample transaction" }, null, 2)
  );

  const endpoints = [
    { value: "/api/accounts", label: "/api/accounts - Get accounts list" },
    { value: "/api/transactions", label: "/api/transactions - Transaction operations" },
    { value: "/api/user-profile", label: "/api/user-profile - User profile data" },
    { value: "/api/payment-methods", label: "/api/payment-methods - Payment methods" },
  ];

  const methods = ["GET", "POST", "PUT", "PATCH", "DELETE"];

  const handleSendRequest = async () => {
    setLoading(true);
    setResponse(null);

    try {
      // Create headers
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      };
      
      // Add API key to headers if enabled
      if (useApiKey) {
        headers['api-key'] = apiKey;
      }
      
      // Configure the request
      const requestOptions: RequestInit = {
        method: selectedMethod,
        headers,
        // Only include body for non-GET requests
        ...(selectedMethod !== 'GET' && {
          body: requestBody
        })
      };
      
      // Make the actual API request
      const response = await fetch(selectedEndpoint, requestOptions);
      const data = await response.json();
      
      // Format the response
      const apiResponse: ApiResponse = {
        method: selectedMethod,
        endpoint: selectedEndpoint,
        data,
        timestamp: new Date().toISOString()
      };
      
      setResponse(apiResponse);
    } catch (error) {
      console.error("API Request failed:", error);
      
      // Create error response
      setResponse({
        method: selectedMethod,
        endpoint: selectedEndpoint,
        data: {
          error: "Request Failed",
          message: "An error occurred while making the request",
          details: String(error)
        },
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="vm-card mb-8">
          <h1 className="text-2xl font-bold mb-6 text-[var(--primary)]">API Demonstration</h1>
          <p className="mb-4">
            This demo showcases the Virgin Money API endpoints with various HTTP methods. 
            Select an endpoint, choose a method, and send a request to see the response.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-blue-700 font-medium mb-2">API Reference</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
              <div>
                <p className="font-semibold">Available API Keys:</p>
                <ul className="mt-1 ml-4 list-disc">
                  <li><code className="bg-blue-100 px-1 rounded">vm-api-demo-key-123456</code> - Standard access (default)</li>
                  <li><code className="bg-blue-100 px-1 rounded">vm-api-premium-key-789012</code> - Premium access</li>
                  <li><code className="bg-blue-100 px-1 rounded">vm-api-admin-key-345678</code> - Admin access</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold">Endpoint Information:</p>
                <ul className="mt-1 ml-4 list-disc">
                  <li><code>/api/accounts</code> - Banking accounts data</li>
                  <li><code>/api/transactions</code> - Financial transactions</li>
                  <li><code>/api/user-profile</code> - User information</li>
                  <li><code>/api/payment-methods</code> - Payment options</li>
                </ul>
              </div>
            </div>
            <p className="text-xs text-blue-700 mt-2">For full API documentation, visit the <Link href="/api-docs" className="underline">API Documentation</Link> page.</p>
          </div>
          
          <div className="border-t border-gray-200 pt-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label htmlFor="endpoint" className="vm-label">
                  Endpoint
                </label>
                <select
                  id="endpoint"
                  className="vm-input"
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                >
                  {endpoints.map((endpoint) => (
                    <option key={endpoint.value} value={endpoint.value}>
                      {endpoint.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="method" className="vm-label">
                  HTTP Method
                </label>
                <select
                  id="method"
                  className="vm-input"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  {methods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex items-center mb-6">
              <input
                type="checkbox"
                id="useApiKey"
                className="mr-2 h-4 w-4"
                checked={useApiKey}
                onChange={(e) => setUseApiKey(e.target.checked)}
              />
              <label htmlFor="useApiKey" className="text-sm">
                Use API Key (Required for most endpoints)
              </label>
            </div>
            
            {useApiKey && (
              <div className="mb-6">
                <label htmlFor="apiKey" className="vm-label">
                  API Key
                </label>
                <input
                  type="text"
                  id="apiKey"
                  className="vm-input"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Default key: <code className="bg-gray-100 px-1 rounded">vm-api-demo-key-123456</code>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Other valid keys: <code className="bg-gray-100 px-1 rounded">vm-api-premium-key-789012</code>, <code className="bg-gray-100 px-1 rounded">vm-api-admin-key-345678</code>
                </p>
              </div>
            )}
            
            {(selectedMethod === "POST" || selectedMethod === "PUT" || selectedMethod === "PATCH") && (
              <div className="mb-6">
                <label htmlFor="requestBody" className="vm-label">
                  Request Body (JSON)
                </label>
                <textarea
                  id="requestBody"
                  rows={5}
                  className="vm-input font-mono text-sm"
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                ></textarea>
              </div>
            )}
            
            <div className="flex justify-end">
              <button
                onClick={handleSendRequest}
                disabled={loading}
                className="vm-button"
              >
                {loading ? "Sending..." : "Send Request"}
              </button>
            </div>
          </div>
        </div>
        
        {response && (
          <div className="vm-card">
            <h2 className="text-xl font-bold mb-4">Response</h2>
            <div className="mb-2">
              <span className="font-bold">Endpoint:</span> {response.endpoint}
            </div>
            <div className="mb-2">
              <span className="font-bold">Method:</span> {response.method}
            </div>
            <div className="mb-2">
              <span className="font-bold">Timestamp:</span> {new Date(response.timestamp).toLocaleString()}
            </div>
            <div className="mt-4">
              <span className="font-bold">Data:</span>
              <pre className="bg-[var(--vm-light-gray)] p-4 rounded-md mt-2 overflow-x-auto text-sm">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-[var(--primary)] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
