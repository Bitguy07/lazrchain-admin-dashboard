import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

// Helper: Generate a unique referral code based on email
async function generateUniqueReferralCode(email: string): Promise<string> {
  const prefix = email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '').slice(0, 5);
  let referralCode = '';
  let isUnique = false;

  while (!isUnique) {
    const random = Math.random().toString(36).substring(2, 8); // 6 characters
    referralCode = `${prefix}${random}`;
    const existing = await User.findOne({ referralCode });
    if (!existing) isUnique = true;
  }

  return referralCode;
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword, referralCodeReferredBy } = await req.json();

    // 1. Validate required fields
    if (!email || !password || !confirmPassword) {
      return Response.json(
        { error: 'All fields are required .', type: 'MISSING_FIELDS' },
        { status: 400 }
      );
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json(
        { error: 'Invalid email format.', type: 'INVALID_EMAIL' },
        { status: 400 }
      );
    }

    // 3. Password match and strength
    if (password !== confirmPassword) {
      return Response.json(
        { error: 'Passwords do not match.', type: 'PASSWORD_MISMATCH' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { error: 'Password must be at least 8 characters.', type: 'PASSWORD_TOO_SHORT' },
        { status: 400 }
      );
    }

    await dbConnect();

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'User already exists.', type: 'USER_EXISTS' },
        { status: 409 }
      );
    }

    // 5. Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // 6. Generate a unique referral code
    const referralCode = await generateUniqueReferralCode(email);

    // 7. Set referredBy to null if empty
    const referredBy = referralCodeReferredBy?.trim() || null;

    // 8. Create new user
    const newUser = new User({
      email,
      passwordHash,
      referralCode,
      referredBy,
    });

    await newUser.save();

    return Response.json(
      {
        message: 'User created successfully',
        email: newUser.email,
        referralCode: newUser.referralCode,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('Signup error:', err);
    return Response.json(
      { error: 'Internal server error', type: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
