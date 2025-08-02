import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email, walletAddress } = await req.json();

    if (!email || !walletAddress) {
      return NextResponse.json(
        { success: false, type: "MISSING_FIELDS", message: "Email and wallet address are required." },
        { status: 400 }
      );
    }

    const user = await User.findOneAndUpdate(
      { email },
      { walletAddress },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, type: "USER_NOT_FOUND", message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      type: "WALLET_UPDATED",
      message: "Wallet address saved successfully.",
      walletAddress: user.walletAddress,
    });
  } catch (error) {
    console.error("Wallet Save Error:", error);
    return NextResponse.json(
      { success: false, type: "SERVER_ERROR", message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
