import { runReferralBonusCalculation } from "@/utils/dilyReferralEarnings";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await runReferralBonusCalculation();
    return NextResponse.json({ success: true, message: 'Referral earnings processed ✅' });
  } catch (error) {
    console.error('Referral bonus cronjob failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
