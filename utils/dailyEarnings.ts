// cronjob or handler to run at 12:01 AM
import connectdb from '@/lib/mongodb';
import Deposit from '@/models/UserDeposit';
import UserDailyEarning from '@/models/UserDailyEarning';
import InvestmentTier from '@/models/InvestmentTier';
import { calculateYield } from '@/utils/calculateYield';
import mongoose from 'mongoose';

interface Transaction {
  amount: number;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
  date: Date;
}

export async function runDailyEarningsCalculation() {
  await connectdb();

  const yesterdayStart = new Date();
  yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
  yesterdayStart.setUTCHours(0, 0, 0, 0);

  const yesterdayEnd = new Date();
  yesterdayEnd.setUTCDate(yesterdayEnd.getUTCDate() - 1);
  yesterdayEnd.setUTCHours(23, 59, 59, 999);

  const allDeposits = await Deposit.find({});

  for (const userDeposit of allDeposits) {
    const { userId, transactions, totalDeposited } = userDeposit as {
      userId: mongoose.Types.ObjectId;
      transactions: Transaction[];
      totalDeposited: number;
    };

    // 1. Get transactions from yesterday
    const yesterdayTxs: Transaction[] = transactions.filter(
      (tx: Transaction) =>
        tx.status === 'confirmed' &&
        new Date(tx.date) >= yesterdayStart &&
        new Date(tx.date) <= yesterdayEnd
    );

    if (yesterdayTxs.length === 0) continue;

    // 2. Check if earning already calculated for this date
    const alreadyExists = await UserDailyEarning.findOne({
      userId,
      date: {
        $gte: yesterdayStart,
        $lte: yesterdayEnd,
      },
    });

    if (alreadyExists) continue;

    // 3. Determine interest rate tier for totalDeposited
    const tier = await InvestmentTier.findOne({
      min: { $lte: totalDeposited },
      max: { $gt: totalDeposited },
    });

    if (!tier) continue;

    // 4. Random interest rate within tier range
    const interestPercent =
      tier.dailyYieldMin + Math.random() * (tier.dailyYieldMax - tier.dailyYieldMin);

    // 5. Calculate total yield from yesterday's transactions
    const yesterdayTimestamp = Math.floor(yesterdayEnd.getTime() / 1000);

    const totalYield = yesterdayTxs.reduce((acc: number, tx: Transaction) => {
      const depositTimestamp = Math.floor(new Date(tx.date).getTime() / 1000);
      const yieldAmount = calculateYield({
        principal: tx.amount,
        depositTimestamp,
        interestPercent,
        currentTimestamp: yesterdayTimestamp,
        compounding: false,
      });
      return acc + yieldAmount;
    }, 0);

    const investedAmount = yesterdayTxs.reduce((sum, tx) => sum + tx.amount, 0);

    // 6. Save with updated schema: profitAmount + investedAmount
    await UserDailyEarning.create({
      userId,
      date: yesterdayStart,
      profitAmount: parseFloat(totalYield.toFixed(6)),
      investedAmount: parseFloat(investedAmount.toFixed(2)),
    });
  }

  console.log('[DAILY EARNINGS] Completed successfully');
}
