

import { NextResponse } from 'next/server';
import connectdb from '@/lib/mongodb';
import UserReferral from '@/models/UserReferral';
import mongoose from 'mongoose';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  try {
    await connectdb();

    const referralData = await UserReferral.findOne({
      referrerId: new mongoose.Types.ObjectId(userId),
    });

    if (!referralData) {
      return NextResponse.json({
        totalReferrals: 0,
        dailyEarnings: 0,
        activeReferrals: 0,
        referrals: [],
      });
    }

    const activeReferrals = referralData.referrals.filter(
      (r:any) => r.status === 'active'
    );

    return NextResponse.json({
      totalReferrals: referralData.totalReferrals,
      dailyEarnings: referralData.dailyEarnings,
      activeReferrals: activeReferrals.length,
      referrals: referralData.referrals.map((r:any) => ({
        email: r.email,
        investment: `$${r.investment.toFixed(2)}`,
        reward: `$${r.dailyReward.toFixed(4)}`,
        earnings: `$${r.yourEarnings.toFixed(4)}`,
        status: r.status.charAt(0).toUpperCase() + r.status.slice(1),
      })),
    });
  } catch (err) {
    console.error('[REFERRAL_FETCH_ERROR]', err);
    return NextResponse.json(
      { error: 'Failed to fetch referral data' },
      { status: 500 }
    );
  }
}
