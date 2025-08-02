import connectdb from '@/lib/mongodb';
import mongoose from 'mongoose';
import UserReferral from '@/models/UserReferral';

export async function runAutoClaimReferral() {
  await connectdb();

  const yesterdayStart = new Date();
  yesterdayStart.setUTCDate(yesterdayStart.getUTCDate() - 1);
  yesterdayStart.setUTCHours(0, 0, 0, 0);

  const yesterdayEnd = new Date();
  yesterdayEnd.setUTCDate(yesterdayEnd.getUTCDate() - 1);
  yesterdayEnd.setUTCHours(23, 59, 59, 999);

  const allReferrals = await UserReferral.find();

  let updatedUsers = 0;
  let updatedEntries = 0;

  for (const userReferral of allReferrals) {
    let modified = false;

    userReferral.referralEarnings.forEach((entry: any) => {
      const entryDate = new Date(entry.date);
      if (
        entry.status === 'notClaimed' &&
        entryDate >= yesterdayStart &&
        entryDate <= yesterdayEnd
      ) {
        entry.status = 'claimed';
        modified = true;
        updatedEntries++;
      }
    });

    if (modified) {
      await userReferral.save();
      updatedUsers++;
    }
  }

  console.log(`[AUTO_CLAIM] Done ✅ Updated ${updatedUsers} users, ${updatedEntries} entries`);
  await mongoose.disconnect();
}
