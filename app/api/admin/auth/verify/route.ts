import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; 
import jwt from 'jsonwebtoken';

export async function GET(req: Request) {
  const cookieStore = await cookies(); 
  const token = cookieStore.get('authToken')?.value;

  if (!token) {
    return NextResponse.json({ isAuthenticated: false, error: 'Token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY!) as any;
    const { id, email } = decoded;
    return NextResponse.json({
      isAuthenticated: true,
      id,
      email
    });
  } catch (err) {
    return NextResponse.json({ isAuthenticated: false, error: 'Invalid token' });
  }
}
