import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectdb from '@/lib/mongodb';
import UserReferral from '@/models/UserReferral';

export async function GET(req: NextRequest) {
  try {
    await connectdb();

    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          type: 'INVALID_USER_ID',
          title: 'Invalid User',
          description: 'The user ID provided is invalid or missing.',
        },
        { status: 400 }
      );
    }

    const objectId = new mongoose.Types.ObjectId(userId);

    // Define yesterday's start and end (UTC)
    const yesterdayStart = new Date();
    yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
    yesterdayStart.setUTCHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setUTCDate(yesterdayEnd.getUTCDate() - 1);
    yesterdayEnd.setUTCHours(23, 59, 59, 999);

    // Fetch user referral document
    const userReferral = await UserReferral.findOne({ referrerId: objectId });


    if (!userReferral) {
      return NextResponse.json(
        {
          type: 'NOT_FOUND',
          title: 'No Referral Data',
          description: 'No referral record exists for this user.',
        },
        { status: 404 }
      );
    }

    // Filter only entries from yesterday AND status === 'notClaimed'
    const yesterdayEarnings = userReferral.referralEarnings.filter((entry: any) => {
      const date = new Date(entry.date);
      return (
        date >= yesterdayStart &&
        date <= yesterdayEnd &&
        entry.status === 'notClaimed'
      );
    });

    // Sum the earnings
    const totalAmount = yesterdayEarnings.reduce((sum: number, entry: any) => sum + entry.amount, 0);

    return NextResponse.json(
      {
        date: yesterdayStart.toISOString().split('T')[0],
        totalEarnings: parseFloat(totalAmount.toFixed(6)),
        count: yesterdayEarnings.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[REFERRAL_EARNINGS_TOTAL_ERROR]', error);
    return NextResponse.json(
      {
        type: 'SERVER_ERROR',
        title: 'Server Error',
        description: 'An error occurred while fetching referral earnings.',
      },
      { status: 500 }
    );
  }
}
