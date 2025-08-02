export const runtime = 'nodejs';

import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Deposit from '@/models/UserDeposit';
import UserReferral, { IUserReferral } from '@/models/UserReferral';
import { createTronWebInstance, createReadOnlyTronWebInstance } from '@/lib/tronwebClient';

const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS!;
const ADMIN_PRIVATE_KEY = process.env.ADMIN_PRIVATE_KEY!;

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { userId, amount } = await req.json();

    if (!userId || !amount) {
      return NextResponse.json(
        { type: 'MISSING_FIELDS', message: 'userId and amount are required.' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user || !user.walletAddress) {
      return NextResponse.json(
        { type: 'USER_NOT_FOUND', message: 'User or wallet address not found.' },
        { status: 404 }
      );
    }

    const referralDoc = await UserReferral.findOne({ referrerId: user._id });
    const deposit = await Deposit.findOne({ userId });

    if (!deposit) {
      return NextResponse.json(
        { type: 'DEPOSIT_NOT_FOUND', message: 'User has no deposit record.' },
        { status: 404 }
      );
    }
    if (!referralDoc) {
      return NextResponse.json(
        { type: 'REFERRAL_NOT_FOUND', message: 'No referral data found.' },
        { status: 404 }
      );
    }

    const referralData = referralDoc.toObject() as IUserReferral;

    let remainingAmount = amount;
    let updatedReferralEarning = referralData.totalReferralEarning || 0;
    let updatedDepositAmount = deposit.totalDeposited;


    if (updatedReferralEarning >= remainingAmount) {
      const newEarning = updatedReferralEarning - remainingAmount;
      referralDoc.set('totalReferralEarning', newEarning);
      referralDoc.markModified('totalReferralEarning');
      updatedReferralEarning = newEarning;
      remainingAmount = 0;
    } else {
      remainingAmount -= updatedReferralEarning;
      referralDoc.set('totalReferralEarning', 0);
      referralDoc.markModified('totalReferralEarning');
      updatedReferralEarning = 0;

      if (updatedDepositAmount < remainingAmount) {
        return NextResponse.json(
          { type: 'INSUFFICIENT_FUNDS', message: 'Withdrawal exceeds balance.' },
          { status: 400 }
        );
      }

      updatedDepositAmount -= remainingAmount;
      remainingAmount = 0;
    }

    // 1. Initiate the transfer from admin wallet to user
    const tronWeb = createTronWebInstance(ADMIN_PRIVATE_KEY);
    const contract = await tronWeb.contract().at(USDT_CONTRACT_ADDRESS);
    let txHash;
    try {
      txHash = await contract.methods.transfer(user.walletAddress, amount * 1_000_000).send();
    } catch (err) {
      console.error('Transfer Error:', err);
      return NextResponse.json(
        { type: 'TX_SEND_ERROR', message: 'Transaction failed.' },
        { status: 500 }
      );
    }

    // 2. Confirm transaction on-chain
    const adminWeb = createReadOnlyTronWebInstance();
    let txInfo;
    try {
      txInfo = await adminWeb.trx.getTransaction(txHash);
    } catch (err) {
      return NextResponse.json(
        { type: 'TX_NOT_FOUND', message: 'Transaction not found on-chain.' },
        { status: 400 }
      );
    }

    const success = txInfo.ret?.[0]?.contractRet === 'SUCCESS';
    if (!success) {
      return NextResponse.json(
        { type: 'TX_FAILED', message: 'Transaction failed or was reverted.' },
        { status: 500 }
      );
    }

    // 3. Save updates
    await referralDoc.save();

    deposit.totalDeposited = updatedDepositAmount;
    await deposit.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Withdrawal successful.',
        txHash,
        amount,
        wallet: user.walletAddress,
        updatedReferralEarning,
        updatedDepositAmount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Withdrawal Server Error:', error);
    return NextResponse.json(
      { type: 'SERVER_ERROR', message: 'Unexpected server error.' },
      { status: 500 }
    );
  }
}
