// app/api/user/auth/signin/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();

  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { type: 'MISSING_FIELDS', message: 'Email and password are required.' },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json(
      { type: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) {
    return NextResponse.json(
      { type: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' },
      { status: 401 }
    );
  }

  // Sign JWT using jose
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const token = await new SignJWT({
    id: user._id.toString(),
    email: user.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret);

  // Set JWT as HttpOnly cookie
  const res = NextResponse.json({
    message: 'Login successful',
    email: user.email,
    _id: user._id.toString(),
    isAuthenticated: true,
  });

  res.cookies.set('authUserToken', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60, // 1 hour
    path: '/',
    sameSite: 'lax',
  });
  return res;
}
