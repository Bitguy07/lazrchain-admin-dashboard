// app/api/user/total-yield/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Deposit from '@/models/UserDeposit';
import UserReferral from '@/models/UserReferral';

export async function GET(req: Request) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { type: 'MISSING_USER_ID', message: 'userId is required.' },
        { status: 400 }
      );
    }

    const [deposit, referral] = await Promise.all([
      Deposit.findOne({ userId }),
      UserReferral.findOne({ referrerId: userId }),
    ]);

    const totalDeposited = deposit?.totalDeposited || 0;
    const totalReferralEarning = referral?.totalReferralEarning || 0;

    const totalYield = totalDeposited + totalReferralEarning;

    return NextResponse.json(
      {
        success: true,
        totalDeposited,
        totalReferralEarning,
        totalYield,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Yield fetch error:', error);
    return NextResponse.json(
      {
        type: 'SERVER_ERROR',
        message: 'An error occurred while calculating total yield.',
      },
      { status: 500 }
    );
  }
}
