import connectMongoDB from "@/lib/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/aurika";
export const runtime = "nodejs";
import jwt from "jsonwebtoken";

// Token verification
function verifyToken(req) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("No token provided");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error("Invalid token");
  }
}

// POST handler
export async function POST(request) {
  const { action, walletAddress, name, email, password, pin, order } =
    await request.json();
  const user = verifyToken(request);

  if (user.walletAddress === walletAddress) {
    // Create user
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

    // Add order
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
          return NextResponse.json(
            { error: "User not found" },
            { status: 404 }
          );
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

    // Gift order
    if (action === "giftOrder") {
      if (
        !walletAddress || // sender's wallet
        !order.receiverWallet || // receiver's wallet
        !order.type ||
        !order.hash ||
        !order.avgPrice ||
        !order.quantity ||
        !order.totalValue
      ) {
        return NextResponse.json(
          { error: "Missing required fields for gift order" },
          { status: 400 }
        );
      }

      try {
        await connectMongoDB();

        const sender = await User.findOne({ walletAddress });
        if (!sender) {
          return NextResponse.json(
            { error: "Sender not found" },
            { status: 404 }
          );
        }

        const receiver = await User.findOne({ walletAddress: order.receiverWallet });
        if (!receiver) {
          return NextResponse.json(
            { error: "Receiver not found" },
            { status: 404 }
          );
        }

        // Add order to sender
        sender.orders.push({
          type: order.type,
          status: "completed",
          hash: order.hash,
          avgPrice: order.avgPrice,
          quantity: order.quantity,
          totalValue: order.totalValue,
        });

        // Add order to receiver
        receiver.orders.push({
          type: "gift received",
          status: "completed",
          hash: order.hash,
          avgPrice: order.avgPrice,
          quantity: order.quantity,
          totalValue: order.totalValue,
          });

        await sender.save();
        await receiver.save();

        return NextResponse.json(
          { message: "Gift order processed successfully" },
          { status: 201 }
        );
      } catch (error) {
        console.error("Error processing gift order:", error);
        return NextResponse.json(
          { error: "Failed to process gift order" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } else {
    return NextResponse.json({ error: "Unauthorized request" }, { status: 401 });
  }
}

// GET handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Missing wallet address" },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const loggedInUser = verifyToken(request);
    const targetUser = await User.findOne({ walletAddress });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isSelf = loggedInUser.walletAddress === walletAddress;

    return NextResponse.json(
      {
        message: "Wallet address found",
        exists: true,
        walletAddress: targetUser.walletAddress,
        name: targetUser.name,
        email: isSelf ? targetUser.email : undefined,
        pin: isSelf ? targetUser.pin : undefined,
        orders: isSelf ? targetUser.orders : [],
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
