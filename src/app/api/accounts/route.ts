import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '../auth-utils-fix';

// Mock data for accounts
const accounts = [
  { id: "acc-001", name: "Current Account", balance: 2567.89, currency: "GBP" },
  { id: "acc-002", name: "Savings Account", balance: 15890.50, currency: "GBP" },
  { id: "acc-003", name: "Credit Card", balance: -357.24, currency: "GBP" },
];

export async function GET(request: NextRequest) {
  // Validate API key for all endpoints except user-profile
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  return NextResponse.json(accounts);
}

export async function POST(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  try {
    const data = await request.json() as { name?: string };
    
    // Simple validation
    if (!data.name) {
      return NextResponse.json({ error: "Invalid request", message: "Account name is required" }, { status: 400 });
    }
    
    // Create a new account (mocked response)
    const newAccount = {
      id: `acc-${Math.floor(1000 + Math.random() * 9000)}`,
      name: data.name,
      balance: 0.00,
      currency: "GBP",
      status: "created"
    };
    
    return NextResponse.json(newAccount, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request", message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Account updated successfully" });
}

export async function PATCH(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Account partially updated successfully" });
}

export async function DELETE(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Account deleted successfully" });
}
