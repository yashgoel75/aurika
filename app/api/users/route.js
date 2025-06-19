import { connectMongoDB } from "@/libs/mongodb";
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectMongoDB();
    const users = await User.find({});
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}