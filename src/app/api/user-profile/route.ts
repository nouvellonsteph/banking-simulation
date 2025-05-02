import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey } from '../auth-utils-fix';

// Mock user profile data
const userProfile = {
  id: "user-001",
  name: "John Smith",
  email: "john.smith@example.com",
  phone: "+44 7012 345678",
  address: "123 High Street, London, UK",
  preferences: {
    notifications: true,
    marketingEmail: false
  }
};

export async function GET() {
  // SECURITY VULNERABILITY: No API key required for GET request on user profile
  // This is intentional for the security demo
  
  return NextResponse.json(userProfile);
}

export async function POST(request: NextRequest) {
  // Validate API key for all other methods
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  return NextResponse.json({ message: "User profile created successfully" }, { status: 201 });
}

export async function PUT(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  try {
    const data = await request.json() as { name?: string, email?: string };
    
    // Return updated profile (mock)
    return NextResponse.json({
      id: "user-001",
      name: data.name || userProfile.name,
      email: data.email || userProfile.email,
      message: "Profile updated successfully"
    });
  } catch {
    return NextResponse.json({ error: "Bad request", message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  try {
    const data = await request.json() as { name?: string, email?: string };
    
    // Return updated profile (mock)
    return NextResponse.json({
      id: "user-001",
      name: data.name || userProfile.name,
      email: data.email || userProfile.email,
      message: "Profile partially updated successfully"
    });
  } catch {
    return NextResponse.json({ error: "Bad request", message: "Invalid JSON body" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  // Validate API key
  const authError = validateApiKey(request);
  if (authError) return authError;
  
  return NextResponse.json({ message: "User profile deleted successfully" });
}
