import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import InvestmentTier from '@/models/InvestmentTier';

export async function GET() {
  await dbConnect();

  try {
    const tiers = await InvestmentTier.find().sort({ min: 1 });

    return NextResponse.json(
      { success: true, tiers },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching investment tiers:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load investment tiers' },
      { status: 500 }
    );
  }
}
