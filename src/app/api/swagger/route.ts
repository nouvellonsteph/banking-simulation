import { NextResponse, type NextRequest } from 'next/server';

/**
 * Redirect from the old /api/swagger route to the new /api/api-docs route
 */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/api-docs', request.url), 308); // 308 is Permanent Redirect
}
