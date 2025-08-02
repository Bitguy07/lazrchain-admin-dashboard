import { NextResponse } from 'next/server';
import connectdb from '@/lib/mongodb';
import Deposit from '@/models/UserDeposit';
import { calculateYield } from '@/utils/calculateYield';
import mongoose from 'mongoose';

interface Transaction {
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
  date: Date;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  }

  await connectdb();

  const userDeposit = await Deposit.findOne({ userId: new mongoose.Types.ObjectId(userId) });

  if (!userDeposit || !userDeposit.transactions || userDeposit.transactions.length === 0) {
    return NextResponse.json({ yield: 0, details: [] });
  }

  const currentTimestamp = Math.floor(Date.now() / 1000);
  const transactions = userDeposit.transactions as Transaction[];

  const yieldDetails = transactions
    .filter((tx) => tx.status === 'confirmed')
    .map((tx) => {
      const virtualYield = calculateYield({
        principal: tx.amount,
        depositTimestamp: Math.floor(new Date(tx.date).getTime() / 1000),
        interestPercent: userDeposit.interestRate,
        currentTimestamp,
      });

      return {
        txHash: tx.txHash,
        amount: tx.amount,
        depositedAt: tx.date,
        virtualYield,
      };
    });

  const totalYield = yieldDetails.reduce((sum, tx) => sum + tx.virtualYield, 0);

  return NextResponse.json({
    yield: parseFloat(totalYield.toFixed(6)),
    interestRate: userDeposit.interestRate,
    totalDeposited: userDeposit.totalDeposited,
    yieldPerSecond: parseFloat(
      (userDeposit.totalDeposited * userDeposit.interestRate / 100 / 86400).toFixed(6)
    ),
    details: yieldDetails,
  });
}
