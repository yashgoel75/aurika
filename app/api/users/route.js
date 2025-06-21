import { connectMongoDB } from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/aurika";

export async function POST(request) {
  const { walletAddress, name, email, password, pin } = await request.json();

  if (!walletAddress || !name || !email || !password || !pin) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    await connectMongoDB();

    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 }
      );
    }

    const newUser = new User({
      walletAddress,
      name,
      email,
      password,
      pin,
    });

    await newUser.save();

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    await connectMongoDB();

    const user = await User.findOne({ walletAddress });
    return NextResponse.json(
      {
        message: user
          ? "Wallet address found"
          : "Wallet address not found",
        exists: !!user,
        walletAddress: user ? user.walletAddress : null,
        name: user ? user.name : null,
        email: user ? user.email : null,
        pin: user ? user.pin : null
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
