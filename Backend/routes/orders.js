import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { downloadOrderBill, getMyOrders } from "../controllers/orderController.js";

const router = express.Router();

router.get("/my", protect, getMyOrders);
router.get("/:orderId/bill", protect, downloadOrderBill);

export default router;
