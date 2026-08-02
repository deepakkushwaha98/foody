import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { getDeliveryBoyAssigment, getOrderById, verifyDeliveryOtp, sendDeliveryOtp, getMyOrders, placeOrder, updateOrderStatus, getCurrentOrder, acceptOrder, getMostOrderedItems, rateOrderItem } from "../controllers/order.controller.js"

const orderRouter = express.Router()

orderRouter.post("/place-order" ,isAuth, placeOrder)
orderRouter.get("/my-orders" ,isAuth, getMyOrders)
orderRouter.put("/update-status/:orderId/:shopId" ,isAuth, updateOrderStatus)
orderRouter.post("/send-delivery-otp" ,isAuth, sendDeliveryOtp)
orderRouter.post("/verify-delivery-otp" ,isAuth, verifyDeliveryOtp)
orderRouter.get("/get-assignment" ,isAuth, getDeliveryBoyAssigment)
orderRouter.get("/accept-order/:assignmentId" ,isAuth, acceptOrder)
orderRouter.get("/get-current-order" ,isAuth, getCurrentOrder)
orderRouter.get("/get-order-by-id/:orderId" ,isAuth, getOrderById)
orderRouter.get("/most-ordered" ,isAuth, getMostOrderedItems)
orderRouter.post("/rate-item" ,isAuth, rateOrderItem)
orderRouter.post("/" ,isAuth, placeOrder)

export default orderRouter




