import { resolveCouponDiscount } from "../utils/coupons.js"

export const validateCoupon = async (req, res) => {
    try {
        const { couponCode, subtotal = 0 } = req.body
        const result = resolveCouponDiscount(couponCode, Number(subtotal || 0))
        if (!result.valid) {
            return res.status(400).json(result)
        }

        return res.status(200).json(result)
    } catch (err) {
        return res.status(500).json({ valid: false, discountAmount: 0, message: err.message || "coupon validation error" })
    }
}
