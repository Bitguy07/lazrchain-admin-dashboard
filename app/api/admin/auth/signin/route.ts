import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';

export async function POST(req: Request) {
  await dbConnect();
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'MISSING_FIELDS' }, { status: 400 });
  }

  const admin = await Admin.findOne({ email });
  if (!admin) {
    return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  const ok = await bcrypt.compare(password, admin.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
  }

  // Use jose to sign the JWT
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const token = await new SignJWT({
    id: admin._id.toString(),
    email: admin.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);
  // Set token in HttpOnly cookie
  const res = NextResponse.json({ message: 'Login successful', isAuthenticated: true });
  res.cookies.set('authToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hour in seconds
    path: '/',
    sameSite: 'lax',
  });

  return res;
}
