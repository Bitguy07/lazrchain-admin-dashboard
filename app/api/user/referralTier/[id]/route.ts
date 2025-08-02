import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import ReferralBonusTier from '@/models/ReferralBonusTier';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const id = params.id;
    const body = await request.json();

    const updatedTier = await ReferralBonusTier.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTier) {
      return NextResponse.json(
        { success: false, message: 'Tier not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, updatedTier },
      { status: 200 }
    );
  } catch (error) {
    console.error('[PATCH_REFERRAL_TIER_ERROR]', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update tier' },
      { status: 500 }
    );
  }
}
