import { NextResponse } from 'next/server';

export async function POST() {
  // Create response object
  const res = NextResponse.json({ message: 'Logout successful', isAuthenticated: false });

  // Remove the authToken cookie
  res.cookies.set('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,            // expire immediately
    path: '/',
    sameSite: 'lax',
  });

  return res;
}
