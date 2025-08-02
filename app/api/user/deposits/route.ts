// export const runtime = 'nodejs'; // ensure Node.js runtime

// import { NextResponse } from 'next/server';
// import dbConnect from '@/lib/mongodb';
// import User from '@/models/User';
// import Deposit from '@/models/UserDeposit';
// import { createTronWebInstance, createReadOnlyTronWebInstance } from '@/lib/tronwebClient';

// const ADMIN_ADDRESS = process.env.ADMIN_WALLET_ADDRESS!;
// const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS!;

// // Interest rate logic
// function determineInterestRate(total: number): number {
//   if (total >= 10 && total < 100) return +(0.5 + Math.random() * (2 - 0.5)).toFixed(2);       // 0.5% - 2%
//   if (total >= 100 && total < 500) return +(2 + Math.random() * (4 - 2)).toFixed(2);          // 2% - 4%
//   if (total >= 500 && total < 1500) return +(4 + Math.random() * (6 - 4)).toFixed(2);         // 4% - 6%
//   return 15; // max 15%
// }


// export async function POST(req: Request) {
//   await dbConnect();

//   try {
//     const { privateKey, depositAmount } = await req.json();

//     if (!privateKey || !depositAmount) {
//       return NextResponse.json(
//         {
//           type: 'MISSING_FIELDS',
//           message: 'Private key and deposit amount are required.',
//         },
//         { status: 400 }
//       );
//     }

//     const userWeb = createTronWebInstance(privateKey);
//     const userAddress = userWeb.defaultAddress.base58;

//     const user = await User.findOne({ walletAddress: userAddress });

//     if (!user) {
//       return NextResponse.json(
//         {
//           type: 'USER_NOT_FOUND',
//           message: 'No user found for this wallet address.',
//         },
//         { status: 404 }
//       );
//     }

//     const contract = await userWeb.contract().at(USDT_CONTRACT_ADDRESS);
//     const balanceRaw = await contract.methods.balanceOf(userAddress).call();
//     const balanceInUSDT = Number(balanceRaw) / 1_000_000;

//     if (balanceInUSDT < depositAmount) {
//       return NextResponse.json(
//         {
//           type: 'INSUFFICIENT_FUNDS',
//           message: 'Not enough USDT balance.',
//         },
//         { status: 400 }
//       );
//     }

//     // Transfer
//     let tx;
//     try {
//       tx = await contract.methods.transfer(ADMIN_ADDRESS, depositAmount * 1_000_000).send();
//     } catch (error) {
//       console.error('Transfer Error:', error);
//       return NextResponse.json(
//         {
//           type: 'TX_SEND_ERROR',
//           message: 'Transaction failed while sending USDT.',
//         },
//         { status: 500 }
//       );
//     }

//     // Confirm transaction
//     const adminWeb = createReadOnlyTronWebInstance();
//     const txInfo = await adminWeb.trx.getTransaction(tx);
//     const success = txInfo.ret?.[0]?.contractRet === 'SUCCESS';

//     if (!success) {
//       return NextResponse.json(
//         { type: 'TX_FAILED', message: 'Transaction failed or was reverted.' },
//         { status: 500 }
//       );
//     }

//     // 🌟 Save deposit in updated model
//     const existing = await Deposit.findOne({ userId: user._id });

//     const newTransaction = {
//       amount: depositAmount,
//       status: 'confirmed',
//       txHash: tx,
//       date: new Date(),
//     };

//     let updatedDeposit;

//     if (existing) {
//       existing.totalDeposited += depositAmount;
//       existing.transactions.push(newTransaction);
//       existing.interestRate = determineInterestRate(existing.totalDeposited);
//       updatedDeposit = await existing.save();
//     } else {
//       const interestRate = determineInterestRate(depositAmount);
//       updatedDeposit = await Deposit.create({
//         userId: user._id,
//         totalDeposited: depositAmount,
//         interestRate,
//         transactions: [newTransaction],
//       });
//     }

//     return NextResponse.json(
//       {
//         success: true,
//         message: 'Deposit successful.',
//         txHash: tx,
//         amount: depositAmount,
//         userWallet: userAddress,
//         totalDeposited: updatedDeposit.totalDeposited,
//         interestRate: updatedDeposit.interestRate,
//         date: newTransaction.date,
//       },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.error('Server Error:', error);
//     return NextResponse.json(
//       {
//         type: 'SERVER_ERROR',
//         message: 'Something went wrong during deposit.',
//       },
//       { status: 500 }
//     );
//   }
// }
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Deposit from '@/models/UserDeposit';
import { createReadOnlyTronWebInstance } from '@/lib/tronwebClient';

const ADMIN_ADDRESS = process.env.ADMIN_WALLET_ADDRESS!;
const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS!;

// Interest rate logic
function determineInterestRate(total: number): number {
  if (total >= 10 && total < 100) return +(0.5 + Math.random() * (2 - 0.5)).toFixed(2);
  if (total >= 100 && total < 500) return +(2 + Math.random() * (4 - 2)).toFixed(2);
  if (total >= 500 && total < 1500) return +(4 + Math.random() * (6 - 4)).toFixed(2);
  return 15;
}

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { walletAddress, txHash, amount } = await req.json();

    if (!walletAddress || !txHash || !amount) {
      return NextResponse.json(
        {
          type: 'MISSING_FIELDS',
          message: 'walletAddress, txHash, and amount are required.',
        },
        { status: 400 }
      );
    }

    // 1. Check user exists
    const user = await User.findOne({ walletAddress });
    if (!user) {
      return NextResponse.json(
        {
          type: 'USER_NOT_FOUND',
          message: 'No user is associated with this wallet address.',
        },
        { status: 404 }
      );
    }

    // 2. Confirm transaction on-chain (same as original)
    const adminWeb = createReadOnlyTronWebInstance();
    let txInfo;

    try {
      txInfo = await adminWeb.trx.getTransaction(txHash);
    } catch (err) {
      return NextResponse.json(
        {
          type: 'TX_NOT_FOUND',
          message: 'Transaction not found on-chain.',
        },
        { status: 400 }
      );
    }

    const success = txInfo.ret?.[0]?.contractRet === 'SUCCESS';
    if (!success) {
      return NextResponse.json(
        {
          type: 'TX_FAILED',
          message: 'Transaction failed or was reverted.',
        },
        { status: 500 }
      );
    }

    // 3. Save to DB
    const newTransaction = {
      amount,
      status: 'confirmed',
      txHash,
      date: new Date(),
    };

    let existing = await Deposit.findOne({ userId: user._id });
    let updatedDeposit;

    if (existing) {
      existing.totalDeposited += amount;
      existing.transactions.push(newTransaction);
      existing.interestRate = determineInterestRate(existing.totalDeposited);
      updatedDeposit = await existing.save();
    } else {
      const interestRate = determineInterestRate(amount);
      updatedDeposit = await Deposit.create({
        userId: user._id,
        totalDeposited: amount,
        interestRate,
        transactions: [newTransaction],
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Deposit successful.',
        amount,
        txHash,
        userWallet: walletAddress,
        totalDeposited: updatedDeposit.totalDeposited,
        interestRate: updatedDeposit.interestRate,
        date: newTransaction.date,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server Error (Deposit Confirm):', error);
    return NextResponse.json(
      {
        type: 'SERVER_ERROR',
        message: 'An unexpected server error occurred.',
      },
      { status: 500 }
    );
  }
}
