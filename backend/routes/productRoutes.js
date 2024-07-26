import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
    addProduct,
    updateProductDetails,
    removeProduct,
    fetchProducts,
    fetchProductById,
    fetchAllProducts,
    addProductReview,
    fetchTopProducts,
    fetchNewProducts,
    filterProducts,
    searchProducts,
    removeAllProduct
} from "../controllers/productController.js";
import { authenticate, authorizeAdmin, authorizeVendor, authorizeVendorOrAdmin } from "../middlewares/authMiddleware.js";
import checkId from "../middlewares/checkId.js";

router
    .route("/")
    .get(formidable(), fetchProducts)
    .post(authenticate, authorizeVendor, formidable(), addProduct)
    .delete(authenticate, authorizeVendor, formidable(), removeAllProduct);


router.route("/allproducts").get(authenticate, authorizeVendor, fetchAllProducts);
router.route("/:id/reviews").post(authenticate, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
    .route("/:id")
    .get(fetchProductById)
    .put(authenticate, formidable(), updateProductDetails)
    .delete(authenticate, authorizeVendorOrAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);

router.get('/search/key', searchProducts);

export default router;
