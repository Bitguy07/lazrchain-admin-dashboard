// import mongoose, { Schema, model, models } from 'mongoose';

// const depositSchema = new Schema(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: 'User', // Optional: Replace 'User' with the actual user model name if different
//       required: true,
//     },
//     amount: {
//       type: Number,
//       required: true,
//       min: 0,
//     },
//     status: {
//       type: String,
//       enum: ['pending', 'confirmed', 'failed'],
//       default: 'pending',
//       required: true,
//     },
//     txHash: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     date: {
//       type: Date,
//       default: Date.now,
//     },
//   },
//   {
//     timestamps: true, // adds createdAt and updatedAt automatically
//     versionKey: false,
//   }
// );

// const Deposit = models.Deposit || model('Deposit', depositSchema);
// export default Deposit;

import mongoose, { Schema, model, models } from 'mongoose';

const transactionSchema = new Schema(
  {
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed'],
      default: 'pending',
      required: true,
    },
    txHash: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

const depositSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // Each user has one deposit record
    },
    totalDeposited: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    interestRate: {
      type: Number,
      required: true, // Stored in basis points
    },
    transactions: {
      type: [transactionSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Deposit = models.Deposit || model('Deposit', depositSchema);
export default Deposit;
