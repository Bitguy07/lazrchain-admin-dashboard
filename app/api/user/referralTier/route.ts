import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ReferralBonusTier from '@/models/ReferralBonusTier';

export async function GET() {
  await dbConnect();

  try {
    const tiers = await ReferralBonusTier.find().sort({ minInvestment: 1 });

    return NextResponse.json(
      { success: true, tiers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching referral bonus tiers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load referral bonus tiers' },
      { status: 500 }
    );
  }
}
