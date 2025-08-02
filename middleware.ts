// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const protectedPaths = [
  '/lazrchain-dashboard',
  '/lazrchain-referral-program',
  '/lazrchain-rewards',
  '/lazrchain-settings',
  '/lazrchain-wallet',
];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('authToken')?.value;
  const pathname = req.nextUrl.pathname;

  // Only protect specified routes
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      await jwtVerify(token, secret);

      return NextResponse.next();
    } catch (err) {
      console.error("❌ JWT verification failed:", (err as Error).message);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/lazrchain-:path*'],
};
