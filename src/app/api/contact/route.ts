import { NextResponse } from 'next/server';

const TURNSTILE_SECRET_KEY = '0x4AAAAAABXgDCSPusRc3MG29sYHQESlAro';
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface TurnstileVerifyResponse {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  token: string | null;
  turnstileEnabled: boolean;
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as ContactFormData;
    const { name, email, message, token } = data;
    
    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Only verify Turnstile if enabled
    if (data.turnstileEnabled) {
      // Validate turnstile token
      if (!token) {
        return NextResponse.json(
          { error: 'Turnstile verification failed: Missing token' },
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
          { error: 'Turnstile verification failed' },
          { status: 400 }
        );
      }
    }

    // Here you would typically save the contact form data or send an email
    // For now, we'll just return success
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in contact form submission:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request' },
      { status: 500 }
    );
  }
}
