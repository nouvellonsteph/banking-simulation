import { NextRequest, NextResponse } from 'next/server';

// Valid API keys that match what's displayed in the UI
export const API_KEYS = {
  STANDARD: "vm-api-demo-key-123456",
  PREMIUM: "vm-api-premium-key-789012",
  ADMIN: "vm-api-admin-key-345678"
};

// Function to validate API key with different access levels
export function validateApiKey(request: NextRequest, requiredLevel: 'standard' | 'premium' | 'admin' = 'standard') {
  const apiKey = request.headers.get('api-key');
  
  if (!apiKey) {
    return NextResponse.json(
      { 
        error: "Unauthorized", 
        message: "Missing API key" 
      },
      { status: 403 }
    );
  }
  
  // Check if the API key is valid based on required level
  if (requiredLevel === 'admin' && apiKey !== API_KEYS.ADMIN) {
    return NextResponse.json(
      { 
        error: "Unauthorized", 
        message: "Admin API key required for this operation" 
      },
      { status: 403 }
    );
  }
  
  if (requiredLevel === 'premium' && 
     (apiKey !== API_KEYS.PREMIUM && apiKey !== API_KEYS.ADMIN)) {
    return NextResponse.json(
      { 
        error: "Unauthorized", 
        message: "Premium or Admin API key required for this operation" 
      },
      { status: 403 }
    );
  }
  
  // For standard level, check if it's any of the valid keys
  if (apiKey !== API_KEYS.STANDARD && 
      apiKey !== API_KEYS.PREMIUM && 
      apiKey !== API_KEYS.ADMIN) {
    return NextResponse.json(
      { 
        error: "Unauthorized", 
        message: "Invalid API key" 
      },
      { status: 403 }
    );
  }
  
  return null; // No error, continue with the request
}

// Login credentials mapping to match what's displayed in the UI
export const VALID_CREDENTIALS = [
  {
    username: "demo_user",
    password: "password123",
    role: "customer",
    name: "Demo User"
  },
  {
    username: "premium_user",
    password: "password123",
    role: "premium",
    name: "Premium User"
  },
  {
    username: "admin_user",
    password: "password123",
    role: "admin",
    name: "Admin User"
  },
  // Keep the original credential from backend code for backward compatibility
  {
    username: "demo",
    password: "password",
    role: "customer",
    name: "Demo User"
  }
];

// Function to validate login credentials
export function validateCredentials(username: string, password: string) {
  return VALID_CREDENTIALS.find(
    user => user.username === username && user.password === password
  );
}
