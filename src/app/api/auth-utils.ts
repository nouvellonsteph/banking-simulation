import { NextRequest, NextResponse } from 'next/server';

// Demo API key - in a real application, this would be stored securely
export const VALID_API_KEY = "vm-api-demo-key-123456";

export function validateApiKey(request: NextRequest) {
  const apiKey = request.headers.get('api-key');
  
  if (!apiKey || apiKey !== VALID_API_KEY) {
    return NextResponse.json(
      { 
        error: "Unauthorized", 
        message: "Invalid or missing API key" 
      },
      { status: 403 }
    );
  }
  
  return null; // No error, continue with the request
}
