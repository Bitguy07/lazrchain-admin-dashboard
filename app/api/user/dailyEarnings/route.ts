import { NextRequest, NextResponse } from 'next/server';
import connectdb from '@/lib/mongodb';
import UserDailyEarning from '@/models/UserDailyEarning';
import { Types } from 'mongoose';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectdb();

    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          type: 'INVALID_USER_ID',
          title: 'Invalid User',
          description: 'The user ID provided is invalid or missing.',
        },
        { status: 400 }
      );
    }

    const earnings = await UserDailyEarning.find(
      { userId: new mongoose.Types.ObjectId(userId)  },
      { date: 1, profitAmount: 1, _id: 0 }
    ).sort({ date: -1 });
    
    if (!earnings || earnings.length === 0) {
      return NextResponse.json(
        {
          type: 'NO_EARNINGS_FOUND',
          title: 'No Earnings',
          description: 'No earnings data available for this user.',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(earnings, { status: 200 });
  } catch (error) {
    console.error('[USER DAILY EARNINGS ERROR]', error);

    return NextResponse.json(
      {
        type: 'SERVER_ERROR',
        title: 'Server Error',
        description: 'Something went wrong while fetching daily earnings.',
      },
      { status: 500 }
    );
  }
}
