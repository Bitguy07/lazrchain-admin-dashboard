import mongoose, { Schema, model, models } from 'mongoose';

const investmentTierSchema = new Schema(
  {
    tierName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    min: {
      type: Number,
      required: true,
      min: 0,
    },
    max: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyYieldMin: {
      type: Number,
      required: true,
      min: 0,
    },
    dailyYieldMax: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const InvestmentTier = models.InvestmentTier || model('InvestmentTier', investmentTierSchema);
export default InvestmentTier;
