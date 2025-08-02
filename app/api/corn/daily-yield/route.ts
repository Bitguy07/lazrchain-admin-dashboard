import { runDailyEarningsCalculation } from "@/utils/dailyEarnings";
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await runDailyEarningsCalculation();
    return NextResponse.json({ success: true, message: 'Daily earnings job done ✅' });
  } catch (error) {
    console.error('Daily earnings cronjob failed:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
