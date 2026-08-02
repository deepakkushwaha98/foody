const couponRules = {
    FOODY100: {
        type: "flat",
        value: 100,
        minSubtotal: 500,
    },
    SAVE50: {
        type: "flat",
        value: 50,
        minSubtotal: 300,
    },
}

export const resolveCouponDiscount = (couponCode, subtotal = 0) => {
    if (!couponCode) return { valid: false, discountAmount: 0, message: "Coupon code is required" }

    const normalized = String(couponCode).trim().toUpperCase()
    const rule = couponRules[normalized]
    if (!rule) {
        return { valid: false, discountAmount: 0, message: "Invalid coupon code" }
    }

    if (subtotal < rule.minSubtotal) {
        return { valid: false, discountAmount: 0, message: `Minimum subtotal for ${normalized} is ₹${rule.minSubtotal}` }
    }

    return {
        valid: true,
        couponCode: normalized,
        discountAmount: rule.value,
        message: "Coupon applied",
    }
}
