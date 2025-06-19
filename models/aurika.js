import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
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
        type: number,
        required: true,
    },
    walletAddress: {
        type: String,
        required: true,
        unique: true,
    },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;