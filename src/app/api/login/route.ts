import { NextResponse } from 'next/server';
import { validateCredentials } from '../auth-utils';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY || '';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

export interface User {
  username: string;
  name: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
  token: string | null;
  turnstileEnabled: boolean;
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as LoginRequest;
    const { username, password, token, turnstileEnabled } = data;
    
    // Validate required fields
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }
    
    // Only verify Turnstile if enabled
    if (turnstileEnabled) {
      // Validate turnstile token
      if (!token) {
        return NextResponse.json(
          { error: 'Security verification failed: Missing token' },
          { status: 400 }
        );
      }

      // Verify turnstile token with Cloudflare
      const formData = new FormData();
      formData.append('secret', TURNSTILE_SECRET_KEY);
      formData.append('response', token);
      
      // Add the user's IP address if available (for improved security)
      const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for');
      if (ip) {
        formData.append('remoteip', ip);
      }

      const result = await fetch(TURNSTILE_VERIFY_URL, {
        method: 'POST',
        body: formData,
      });

      const verification: TurnstileVerifyResponse = await result.json();
      
      if (!verification.success) {
        console.error('Turnstile verification failed:', verification['error-codes']);
        return NextResponse.json(
          { error: 'Security verification failed' },
          { status: 400 }
        );
      }
    }

    // Validate user credentials
    const user = validateCredentials(username, password);
    
    if (user) {
      // In a real app, you would generate a token here and set cookies/session
      return NextResponse.json({
        success: true,
        user: {
          username: user.username,
          name: user.name,
          role: user.role
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }
    
  } catch (error) {
    console.error('Error in login process:', error);
    return NextResponse.json(
      { error: 'An error occurred during login' },
      { status: 500 }
    );
  }
}
