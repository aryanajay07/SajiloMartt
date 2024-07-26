import express from "express";
import {
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
    verifyOtp,
} from "../controllers/userController.js";

import { authenticate, authorizeAdmin, authorizeVendorOrAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router
    .route("/")
    .post(createUser)
    .get(authenticate, authorizeVendorOrAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.post('/verify-otp', verifyOtp);


router
    .route("/profile")
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile);

// ADMIN ROUTES 👇
router
    .route("/:id")
    .delete(authenticate, authorizeAdmin, deleteUserById)
    .get(authenticate, authorizeAdmin, getUserById)
    .put(authenticate, authorizeAdmin, updateUserById);

router.get("/vendors", authenticate, authorizeAdmin, getVendors);
router.delete('/vendors/:id', authenticate, authorizeAdmin, deleteVendorById);

export default router;
