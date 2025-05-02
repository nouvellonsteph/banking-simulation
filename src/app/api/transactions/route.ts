import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '../auth-utils-fix';

// Mock data for transactions
const transactions = [
  { id: "tx-001", accountId: "acc-001", amount: -45.99, description: "Supermarket", date: "2025-04-28" },
  { id: "tx-002", accountId: "acc-001", amount: -12.50, description: "Coffee Shop", date: "2025-04-29" },
  { id: "tx-003", accountId: "acc-001", amount: 1200.00, description: "Salary", date: "2025-04-30" },
];

export async function GET(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  return NextResponse.json(transactions);
}

export async function POST(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  try {
    const data = await request.json() as { 
      accountId?: string, 
      amount?: number, 
      description?: string 
    };
    
    // Simple validation
    if (!data.accountId || !data.amount) {
      return NextResponse.json({ 
        error: "Invalid request", 
        message: "Account ID and amount are required" 
      }, { status: 400 });
    }
    
    // Create a new transaction (mocked response)
    const newTransaction = {
      id: `tx-${Math.floor(1000 + Math.random() * 9000)}`,
      accountId: data.accountId,
      amount: data.amount,
      description: data.description || "New transaction",
      date: new Date().toISOString().split("T")[0],
      status: "processed"
    };
    
    return NextResponse.json(newTransaction, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Bad request", message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Transaction updated successfully" });
}

export async function PATCH(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Transaction partially updated successfully" });
}

export async function DELETE(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  // Generic response for other operations
  return NextResponse.json({ message: "Transaction deleted successfully" });
}
