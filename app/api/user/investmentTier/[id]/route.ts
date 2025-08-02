import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import InvestmentTier from '@/models/InvestmentTier'; 

// PATCH /api/user/investmentTier/[id]
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect();

    const id = params.id;
    const body = await req.json();

    const allowedFields = ['tierName', 'min', 'max', 'dailyYieldMin', 'dailyYieldMax', 'description'];
    const update: Record<string, any> = {};

    // Pick only allowed fields
    for (const field of allowedFields) {
      if (field in body) update[field] = body[field];
    }

    const updatedTier = await InvestmentTier.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updatedTier) {
      return NextResponse.json(
        { success: false, message: 'Investment Tier not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, updatedTier });
  } catch (error: any) {
    console.error('[PATCH /investmentTier/:id]', error);
    return NextResponse.json(
      { success: false, message: 'Server error.', error: error.message },
      { status: 500 }
    );
  }
}
