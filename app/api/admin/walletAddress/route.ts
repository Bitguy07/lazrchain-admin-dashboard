import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, walletAddress } = await req.json();

    // 1. Validate required fields
    if (!email || !walletAddress) {
      return NextResponse.json(
        {
          success: false,
          type: "MISSING_FIELDS",
          message: "Email and wallet address are required.",
        },
        { status: 400 }
      );
    }

    // 2. Update admin walletAddress
    const admin = await Admin.findOneAndUpdate(
      { email },
      { walletAddress },
      { new: true }
    );

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          type: "USER_NOT_FOUND",
          message: "No account found for this email.",
        },
        { status: 404 }
      );
    }

    // 3. Success response
    return NextResponse.json(
      {
        success: true,
        type: "WALLET_UPDATED",
        message: "Wallet address saved successfully.",
        walletAddress: admin.walletAddress,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Wallet Save Error:", error);

    return NextResponse.json(
      {
        success: false,
        type: "SERVER_ERROR",
        message: "Something went wrong while saving wallet address.",
      },
      { status: 500 }
    );
  }
}
