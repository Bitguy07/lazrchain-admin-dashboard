import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserDailyEarning extends Document {
  userId: Types.ObjectId;
  date: Date;               // full ISO date
  investedAmount: number;   // amount invested that day
  profitAmount: number;     // yield/profit generated
}

const UserDailyEarningSchema = new Schema<IUserDailyEarning>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  investedAmount: {
    type: Number,
    required: true,
    min: 0,
  },
  profitAmount: {
    type: Number,
    required: true,
    min: 0,
  },
});

const UserDailyEarning =
  mongoose.models.UserDailyEarning ||
  mongoose.model<IUserDailyEarning>('UserDailyEarning', UserDailyEarningSchema);

export default UserDailyEarning;
