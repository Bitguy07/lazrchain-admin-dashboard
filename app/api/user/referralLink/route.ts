import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json(
      { success: false, type: 'MISSING_EMAIL', message: 'Email is required' },
      { status: 400 }
    );
  }

  try {
    const user = await User.findOne({ email });

    if (!user || !user.referralCode) {
      return NextResponse.json(
        { success: false, type: 'NOT_FOUND', message: 'Referral code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, referralCode: user.referralCode },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, type: 'SERVER_ERROR', message: 'Failed to fetch referral code' },
      { status: 500 }
    );
  }
}
