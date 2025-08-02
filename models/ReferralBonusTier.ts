import mongoose, { Schema, model, models } from 'mongoose';

const referralBonusTierSchema = new Schema(
  {
    tierName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    minInvestment: {
      type: Number,
      required: true,
      min: 0,
    },
    maxInvestment: {
      type: Number,
      required: true,
      min: 0,
    },
    referralPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
    versionKey: false,
  }
);


const ReferralBonusTier =
  models.ReferralBonusTier || model('ReferralBonusTier', referralBonusTierSchema);

export default ReferralBonusTier;
