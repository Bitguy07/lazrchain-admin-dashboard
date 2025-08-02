import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectdb from '@/lib/mongodb';
import UserReferral from '@/models/UserReferral';

export async function PATCH(req: NextRequest) {
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

    // Define yesterday's start and end in UTC
    const yesterdayStart = new Date();
    yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
    yesterdayStart.setUTCHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setUTCDate(yesterdayEnd.getUTCDate() - 1);
    yesterdayEnd.setUTCHours(23, 59, 59, 999);

    // Fetch the user's referral record
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

    let updatedCount = 0;

    // Update entries inline (this is in-memory, then save)
    userReferral.referralEarnings.forEach((entry: any) => {
      const date = new Date(entry.date);
      if (
        date >= yesterdayStart &&
        date <= yesterdayEnd &&
        entry.status === 'notClaimed'
      ) {
        entry.status = 'claimed';
        updatedCount++;
      }
    });

    await userReferral.save();

    return NextResponse.json(
      {
        message: 'Referral earnings updated successfully.',
        updatedCount,
        date: yesterdayStart.toISOString().split('T')[0],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[REFERRAL_EARNINGS_CLAIM_ERROR]', error);
    return NextResponse.json(
      {
        type: 'SERVER_ERROR',
        title: 'Server Error',
        description: 'An error occurred while updating referral earnings.',
      },
      { status: 500 }
    );
  }
}
