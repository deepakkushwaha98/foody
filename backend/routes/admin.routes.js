import express from "express";
import { protect, isAdmin } from "../middlewares/authMiddleware.js";
import {
   getAllUsers,
   getAllShops,
   getAllOrders,
   getDeliveryAssignments
} from "../controllers/admin.controller.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getAllUsers);

router.get("/shops", protect, isAdmin, getAllShops);

router.get("/orders", protect, isAdmin, getAllOrders);

router.get("/delivery", protect, isAdmin, getDeliveryAssignments);

export default router;



