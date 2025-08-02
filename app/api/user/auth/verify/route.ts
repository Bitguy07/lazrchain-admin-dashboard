// app/api/user/auth/verify/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET(req: Request) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('authUserToken')?.value;

  if (!token) {
    return NextResponse.json({
      isAuthenticated: false,
      error: 'Token missing',
    });
  }

  try {
    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      isAuthenticated: true,
      id: payload.id,
      email: payload.email,
    });
  } catch (err) {
    return NextResponse.json({
      isAuthenticated: false,
      error: 'Invalid token',
    });
  }
}
