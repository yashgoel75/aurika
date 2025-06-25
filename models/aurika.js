import mongoose from "mongoose";

const ordersSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    hash: {
      type: String,
      required: true,
    },
    avgPrice: {
      type: String, // Changed from Number to String
      required: true,
    },
    quantity: {
      type: String, // Changed from Number to String
      required: true,
    },
    totalValue: {
      type: String, // Changed from Number to String
      required: true,
    },
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  orders: [ordersSchema],
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;