// models/Admin.ts
import mongoose, { Schema, model, models } from 'mongoose';

const adminSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    walletAddress: {
      type: String,
      default: null,
    },
    USDT_balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // disables __v
  }
);

const Admin = models.Admin || model('Admin', adminSchema);
export default Admin;
