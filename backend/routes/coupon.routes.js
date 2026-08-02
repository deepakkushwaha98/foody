import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { validateCoupon } from "../controllers/coupon.controller.js"

const couponRouter = express.Router()

couponRouter.post("/validate", isAuth, validateCoupon)

export default couponRouter