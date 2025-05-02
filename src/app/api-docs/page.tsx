'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import Script from 'next/script';

// Add TypeScript interface for the window object to include Swagger UI
declare global {
  interface Window {
    // Define more specific types for Swagger UI
    SwaggerUIBundle: {
      (config: {
        url: string;
        dom_id: string;
        deepLinking: boolean;
        presets: unknown[];
        defaultModelsExpandDepth: number;
        defaultModelExpandDepth: number;
        docExpansion: string;
        operationsSorter: string;
        tagsSorter: string;
        persistAuthorization: boolean;
        withCredentials: boolean;
        displayRequestDuration: boolean;
      }): unknown;
      presets: {
        apis: unknown;
      };
      SwaggerUIStandalonePreset: unknown;
    };
    ui: unknown;
  }
}

// Create API docs page with directly embedded Swagger UI
export default function ApiDocs() {
  // Initialize Swagger UI on component mount
  useEffect(() => {
    // Check if SwaggerUIBundle is available
    if (typeof window !== 'undefined' && window.SwaggerUIBundle) {
      // Initialize Swagger UI
      window.ui = window.SwaggerUIBundle({
        url: "/api/openapi",
        dom_id: '#swagger-ui',
        deepLinking: true,
        presets: [
          window.SwaggerUIBundle.presets.apis
        ],
        defaultModelsExpandDepth: 2,
        defaultModelExpandDepth: 2,
        docExpansion: 'list',
        operationsSorter: 'alpha',
        tagsSorter: 'alpha',
        persistAuthorization: true,
        withCredentials: true,
        displayRequestDuration: true,
      });
    }
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Load Swagger UI scripts and CSS */}
      <Script 
        src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js" 
        strategy="beforeInteractive"
      />
      <link 
        rel="stylesheet" 
        href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css"
      />
      <div className="vm-card">
        <h1 className="text-2xl font-bold mb-4 text-[var(--primary)]">Virgin Money API Documentation</h1>
        <p className="mb-6">
          Explore our API endpoints and learn how to integrate with our banking services.
        </p>
        
        <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6">
          <h3 className="text-lg font-bold text-amber-800">Security Notice</h3>
          <p className="text-amber-800">
            All endpoints except <code className="bg-amber-200 px-1 rounded">/api/user-profile</code> (GET) 
            require an API key in the header. This sample API key is: <code className="bg-amber-200 px-1 rounded">vm-api-demo-key-123456</code>
          </p>
        </div>
        
        {/* Custom styling for Swagger UI */}
        <style jsx global>{`
          .swagger-ui .info .title {
            color: #e10718;
          }
          .swagger-ui .opblock-tag {
            color: #333333;
          }
          .swagger-ui .btn.execute {
            background-color: #e10718;
            color: #fff;
            border-color: #e10718;
          }
          .swagger-ui .btn.authorize {
            color: #e10718;
            border-color: #e10718;
          }
          .swagger-ui .info a {
            color: #e10718;
          }
          .swagger-ui {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
          }
          .swagger-ui .wrapper {
            padding: 0;
            max-width: none;
          }
          .swagger-ui .opblock {
            margin-bottom: 10px;
          }
          .topbar {
            display: none;
          }
        `}</style>
        
        {/* Swagger UI container */}
        <div className="rounded-md border border-gray-200">
          <div id="swagger-ui" style={{ minHeight: '600px', height: 'auto', overflow: 'auto' }}></div>
        </div>
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
          <Link href="/api-demo" className="text-[var(--primary)] hover:underline">
            Try API Demo →
          </Link>
          <Link href="/" className="text-[var(--primary)] hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
