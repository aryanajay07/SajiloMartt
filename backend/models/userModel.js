import { required } from "khalti-checkout-web";
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
        favouriteCount: {
            type: Number,
            default: 0,
        },
        image: {
            type: String,
            required: true,
            default: '/uploads/default.png',
        },
        otp: {
            type: String,

        },
        orderCount: {
            type: Number,
            required: true,
            default: 0
        }
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
