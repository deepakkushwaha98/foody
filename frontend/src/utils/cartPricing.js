export const calculateCartSummary = (cartItems) => {
  const subtotal = cartItems.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)
  const platformFee = subtotal > 0 ? 8 : 0
  const packagingCharges = subtotal > 0 ? Math.max(20, Math.round(subtotal * 0.015)) : 0
  const gst = Math.round(subtotal * 0.05)
  const deliveryCharges = subtotal > 500 ? 0 : 40
  const discount = 0
  const total = Math.max(0, subtotal + platformFee + packagingCharges + gst + deliveryCharges - discount)

  return { subtotal, platformFee, packagingCharges, gst, deliveryCharges, discount, total }
}