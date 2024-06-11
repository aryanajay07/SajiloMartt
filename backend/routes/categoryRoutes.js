import express from "express";
const router = express.Router();
import {
    createCategory,
    updateCategory,
    removeCategory,
    listCategory,
    readCategory,
} from "../controllers/categoryController.js";

import { authenticate, authorizeAdmin, authorizeVendorOrAdmin } from "../middlewares/authMiddleware.js";

router.route("/").post(authenticate, authorizeVendorOrAdmin, createCategory);
router.route("/:categoryId").put(authenticate, authorizeVendorOrAdmin, updateCategory);
router
    .route("/:categoryId")
    .delete(authenticate, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);
router.route("/:id").get(readCategory);

export default router;
