import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, confirmPassword } = await req.json();

    // 1. Validate required fields
    if (!email || !password || !confirmPassword) {
      return Response.json(
        { error: 'All fields are required.', type: 'MISSING_FIELDS' },
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

    // 4. Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return Response.json(
        { error: 'Admin already exists.', type: 'USER_EXISTS' },
        { status: 409 }
      );
    }

    // 5. Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // 6. Create new admin
    const newAdmin = new Admin({
      email,
      passwordHash,
    });

    await newAdmin.save();

    // 7. Success Response
    return Response.json(
      {
        message: 'Admin account created successfully',
        email: newAdmin.email,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('Admin signup error:', err);
    return Response.json(
      { error: 'Internal server error', type: 'SERVER_ERROR' },
      { status: 500 }
    );
  }
}
