import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '../auth-utils-fix';

// Mock data for payment methods
const paymentMethods = [
  { id: "pm-001", type: "Card", last4: "1234", expiry: "05/27" },
  { id: "pm-002", type: "Direct Debit", accountNumber: "****5678", sortCode: "**-**-78" }
];

export async function GET(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  return NextResponse.json(paymentMethods);
}

export async function POST(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  try {
    const data = await request.json() as { 
      type?: string, 
      last4?: string,
      expiry?: string
    };
    
    // Simple validation
    if (!data.type) {
      return NextResponse.json({ 
        error: "Invalid request", 
        message: "Payment method type is required" 
      }, { status: 400 });
    }
    
    // Create a new payment method (mocked response)
    const newPaymentMethod = {
      id: `pm-${Math.floor(1000 + Math.random() * 9000)}`,
      type: data.type,
      last4: data.last4 || "5678",
      expiry: data.expiry || "09/26",
      status: "added"
    };
    
    return NextResponse.json(newPaymentMethod, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request", message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Payment method updated successfully" });
}

export async function PATCH(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Payment method partially updated successfully" });
}

export async function DELETE(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Payment method deleted successfully" });
}
