import { runAutoClaimReferral } from '@/utils/autoClaimReferral';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await runAutoClaimReferral();

    return NextResponse.json({
      success: true,
      message: 'Referral earnings auto-claimed for yesterday ✅',
    });
  } catch (error) {
    console.error('[AUTO_CLAIM_CRON_ERROR]', error);
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
