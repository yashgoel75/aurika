import  connectMongoDB  from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/aurika";
export const runtime = "nodejs";
export async function POST(request) {
  const { action, walletAddress, name, email, password, pin, order } =
    await request.json();

  // Handle user creation
  if (action === "createUser") {
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
        orders: [],
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

  // Handle adding order
  if (action === "addOrder") {
    if (
      !walletAddress ||
      !order.type ||
      !order.hash ||
      !order.avgPrice ||
      !order.quantity ||
      !order.totalValue
    ) {
      return NextResponse.json(
        { error: "Missing required fields for order" },
        { status: 400 }
      );
    }

    try {
      await connectMongoDB();

      const user = await User.findOne({ walletAddress });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      user.orders.push({
        type: order.type,
        status: order.status,
        hash: order.hash,
        avgPrice: order.avgPrice,
        quantity: order.quantity,
        totalValue: order.totalValue,
      });

      await user.save();

      return NextResponse.json(
        { message: "Order added successfully" },
        { status: 201 }
      );
    } catch (error) {
      console.error("Error adding order:", error);
      return NextResponse.json(
        { error: "Failed to add order" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");
    await connectMongoDB();

    const user = await User.findOne({ walletAddress });
    return NextResponse.json(
      {
        message: user ? "Wallet address found" : "Wallet address not found",
        exists: !!user,
        walletAddress: user ? user.walletAddress : null,
        name: user ? user.name : null,
        email: user ? user.email : null,
        pin: user ? user.pin : null,
        orders: user ? user.orders : [],
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
