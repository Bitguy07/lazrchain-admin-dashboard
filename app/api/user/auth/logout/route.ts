
import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logout successful', isAuthenticated: false });

  // Clear the authUserToken cookie
  res.cookies.set('authUserToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0,
    path: '/',
    sameSite: 'lax',
  });

  return res;
}
