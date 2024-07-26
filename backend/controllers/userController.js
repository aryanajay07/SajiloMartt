import User from "../models/userModel.js";
import nodemailer from 'nodemailer';
import speakeasy from 'speakeasy';
import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcryptjs";
import createToken from "../utils/createToken.js";
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'realajaryan@gmail.com',
        pass: 'aryanajay',
    },
});

const sendOtpEmail = (email, otp) => {
    const mailOptions = {
        from: 'realajaryan@gmail.com',
        to: email,
        subject: 'SajiloMart OTP Code',
        text: `Your OTP code is ${otp}`,
    };
    console.log("after mailoptions")
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        console.log("inside transportaer")

    });
};

const createUser = asyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
        res.status(400).json({ message: "Please fill all the inputs." });
        return;
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400).json({ message: "User already exists" });
        return;
    }

    // Generate OTP
    const otp = speakeasy.totp({
        secret: process.env.OTP_SECRET,
        encoding: 'base32',
    });
    console.log("otp", otp);

    const otpToken = jwt.sign({ email, otp }, process.env.JWT_SECRET, { expiresIn: '10m' });

    sendOtpEmail(email, otp);
    console.log("otpToken: " + otpToken);
    // Send OTP response immediately
    res.status(200).json({ message: "OTP sent to your email address.", otpToken });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashedPassword, role });

    try {
        await newUser.save();
        createToken(res, newUser._id);
    } catch (error) {
        console.error(error);
    }
});

const verifyOtp = asyncHandler(async (req, res) => {
    const { otp, otpToken, username, email, password, role } = req.body;

    try {
        const decoded = jwt.verify(otpToken, process.env.JWT_SECRET);

        if (decoded.otp === otp) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({ username, email, password: hashedPassword, role });

            try {
                await newUser.save();
                createToken(res, newUser._id);

                res.status(201).json({
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    role: newUser.role,
                });
            } catch (error) {
                res.status(400).json({ message: "Invalid OTP." });
            }
        } else {
            res.status(400).send("Invalid OTP.");
        }
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired OTP token." });
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    console.log(email);
    console.log(password);

    const existingUser = await User.findOne({ email });

    if (!existingUser) {
        res.status(401).json({ message: "Invalid email " });
        return;
    }

    if (existingUser) {
        const isPasswordValid = await bcrypt.compare(
            password,
            existingUser.password
        );
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid  password" });
            return;
        }

        if (isPasswordValid) {
            createToken(res, existingUser._id);

            res.status(201).json({
                _id: existingUser._id,
                username: existingUser.username,
                email: existingUser.email,
                role: existingUser.role,
            }

            );
            return;
        }

    }
});

const logoutCurrentUser = asyncHandler(async (req, res) => {
    res.cookie("jwt", "", {
        httyOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "Logged out successfully" });
});

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
});

const getCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});

const updateCurrentUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            user.password = hashedPassword;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const deleteUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        if (user.role === "admin") {
            res.status(400);
            throw new Error("Cannot delete admin user");
        }

        await User.deleteOne({ _id: user._id });
        res.json({ message: "User removed" });
    } else {
        res.status(404);
        throw new Error("User not found.");
    }
});

const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.role = Boolean(req.body.role);

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            role: updatedUser.role,
        });
    } else {
        res.status(404);
        throw new Error("User not found");
    }
});
const getVendors = asyncHandler(async (res, req) => {
    try {
        const vendors = await User.find({ role: 'vendor' });
        res.json(vendors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
})

const deleteVendorById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user && user.role === 'vendor') {

        await User.deleteOne({ _id: user._id });
        res.json({ message: "Vendor removed" });
    } else {
        res.status(404);
        throw new Error("Vendor not found.");
    }
})

export {
    createUser,
    loginUser,
    logoutCurrentUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentUserProfile,
    deleteUserById,
    getUserById,
    updateUserById,
    getVendors,
    deleteVendorById,
    verifyOtp
};
