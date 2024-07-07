import express from "express";
const router = express.Router();

import {
    createOrder,
    getAllOrders,
    getUserOrders,
    countTotalOrders,
    calculateTotalSales,
    calcualteTotalSalesByDate,
    findOrderById,
    deleteOrderById, deleteOrders,
    markOrderAsPaid,
    markOrderAsDelivered,
} from "../controllers/orderController.js";

import { authenticate, authorizeVendor } from "../middlewares/authMiddleware.js";

router
    .route("/")
    .post(authenticate, createOrder)
    .get(authenticate, authorizeVendor, getAllOrders);

router.route("/mine").get(authenticate, getUserOrders);
router.route("/total-orders").get(countTotalOrders);
router.route("/total-sales").get(calculateTotalSales);
router.route("/total-sales-by-date").get(calcualteTotalSalesByDate);
router.route("/:id").get(authenticate, findOrderById);
router.route("/:id").delete(authenticate, deleteOrderById);
router.route("/").delete(authenticate, deleteOrders);

router.route("/:id/pay").put(authenticate, markOrderAsPaid);
router.route("/:id/pay").post(authenticate, markOrderAsPaid);

router
    .route("/:id/deliver")
    .put(authenticate, authorizeVendor, markOrderAsDelivered);

export default router;
