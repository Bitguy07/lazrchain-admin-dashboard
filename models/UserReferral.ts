import mongoose, { Schema, model, models, Types, Document } from 'mongoose';

interface Referral {
  _id: Types.ObjectId;
  email: string;
  investment: number;
  dailyReward: number;
  yourEarnings: number;
  status: 'active' | 'pending' | 'inactive';
}

interface ReferralEarning {
  _id: Types.ObjectId;
  amount: number;
  date: Date;
  status: 'notClaimed' | 'pending' | 'claimed' | 'withdrawn';
}

export interface IUserReferral extends Document {
  referrerId: Types.ObjectId;
  referrals: Referral[];
  referralEarnings: ReferralEarning[];
  totalReferrals: number;
  dailyEarnings: number;
  totalReferralEarning: number; 
  createdAt?: Date;
  updatedAt?: Date;
}

// Reused referral schema
const ReferralSchema = new Schema<Referral>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    investment: {
      type: Number,
      default: 0,
      min: 0,
    },
    dailyReward: {
      type: Number,
      default: 0,
      min: 0,
    },
    yourEarnings: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ['active', 'pending', 'inactive'],
      default: 'pending',
    },
  },
  { _id: false }
);

// New schema for daily referral earnings
const ReferralEarningSchema = new Schema<ReferralEarning>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['notClaimed', 'pending', 'claimed', 'withdrawn'],
      default: 'notClaimed',
    },
  },
  { _id: false }
);

const UserReferralSchema = new Schema<IUserReferral>(
  {
    referrerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    referrals: {
      type: [ReferralSchema],
      default: [],
    },
    referralEarnings: {
      type: [ReferralEarningSchema],
      default: [],
    },
    totalReferrals: {
      type: Number,
      default: 0,
    },
    dailyEarnings: {
      type: Number,
      default: 0,
    },
    totalReferralEarning: {
      type: Number,
      default: 0,
      min: 0,
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);

const UserReferral =
  models.UserReferral || model<IUserReferral>('UserReferral', UserReferralSchema);

export default UserReferral;
