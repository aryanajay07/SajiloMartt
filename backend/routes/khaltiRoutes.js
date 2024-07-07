import express from ("express");
const { updateOrderAfterPayment } = require("../controllers/orderController");
const { handleKhaltiCallback } = require("../controllers/khaltiController");
var router = express.Router();

router.get("/callback", handleKhaltiCallback, updateOrderAfterPayment);

module.exports = router;