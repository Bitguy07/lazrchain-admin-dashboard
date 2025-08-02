// cronjob or handler to run at 12:05 AM
import connectdb from '@/lib/mongodb';
import User from '@/models/User';
import UserDailyEarning from '@/models/UserDailyEarning';
import UserReferral from '@/models/UserReferral';
import ReferralBonusTier from '@/models/ReferralBonusTier';
import mongoose from 'mongoose';

export async function runReferralBonusCalculation() {
  await connectdb();

  const yesterdayStart = new Date();
  yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
  yesterdayStart.setUTCHours(0, 0, 0, 0);

  const yesterdayEnd = new Date();
  yesterdayEnd.setUTCDate(yesterdayEnd.getUTCDate() - 1);
  yesterdayEnd.setUTCHours(23, 59, 59, 999);

  // Fetch earnings from yesterday
  const yesterdayEarnings = await UserDailyEarning.find({
    date: { $gte: yesterdayStart, $lte: yesterdayEnd },
  });

  for (const earning of yesterdayEarnings) {
    const user = await User.findById(earning.userId);
    if (!user || !user.referredBy) continue;

    const referrer = await User.findOne({ referralCode: user.referredBy });
    if (!referrer) continue;

    const referrerId = referrer._id;
    const referralEmail = user.email;

    // Get bonus tier
    const tier = await ReferralBonusTier.findOne({
      minInvestment: { $lte: earning.investedAmount },
      maxInvestment: { $gt: earning.investedAmount },
    });

    let bonus = 0;
    if (tier) {
      bonus = parseFloat(((earning.investedAmount * tier.referralPercentage) / 100).toFixed(6));
    }

    const userReferral = await UserReferral.findOne({ referrerId });

    const referralIndex = userReferral?.referrals.findIndex((r: any) => r.email === referralEmail);

    if (referralIndex !== -1 && referralIndex !== undefined && referralIndex >= 0) {
      // Update existing referral
      userReferral.referrals[referralIndex].investment = earning.investedAmount;
      userReferral.referrals[referralIndex].dailyReward = bonus;
      userReferral.referrals[referralIndex].yourEarnings += bonus;
      userReferral.referrals[referralIndex].status = earning.investedAmount > 0 ? 'active' : 'pending';
    } else {
      // Add new referral
      userReferral?.referrals.push({
        _id: new mongoose.Types.ObjectId(),
        email: referralEmail,
        investment: earning.investedAmount,
        dailyReward: earning.profitAmount, 
        yourEarnings: bonus,
        status: earning.investedAmount > 0 ? 'active' : 'pending',
      });
      if (userReferral) {
        userReferral.totalReferrals += 1;
      }
    }

    // Add entry to referral earnings array
    const todayEntry = {
      _id: new mongoose.Types.ObjectId(),
      amount: bonus,
      date: yesterdayStart,
      status: earning.investedAmount > 0 ? 'notClaimed' : 'pending',
    };

    if (!userReferral.referralEarnings) {
      userReferral.referralEarnings = [todayEntry];
    } else {
      userReferral.referralEarnings.push(todayEntry);
    }

    userReferral.dailyEarnings += bonus;
    await userReferral.save();
  }

  console.log('[REFERRAL EARNINGS] Completed successfully');
}
