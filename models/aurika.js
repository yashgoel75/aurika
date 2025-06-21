import mongoose from "mongoose";

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
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
