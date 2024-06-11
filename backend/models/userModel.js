import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        username: {
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

        role: {
            type: String,
            enum: ['admin', 'customer', 'vendor'],
            required: true,
            default: 'customer'
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
