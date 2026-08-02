import Cart from "../models/cart.model.js"
import Item from "../models/item.model.js"

export const getMyCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.userId })
        return res.status(200).json(cart || { items: [], subtotal: 0, outletId: null })
    } catch (err) {
        return res.status(500).json({ message: `get cart error ${err.message || err}` })
    }
}

export const syncCart = async (req, res) => {
    try {
        const { cartItems = [], outletId = null } = req.body
        const itemIds = [...new Set(cartItems.map((item) => String(item?.id || item?._id || "")).filter(Boolean))]
        const menuItems = await Item.find({ _id: { $in: itemIds } }).select("name image price")
        const itemMap = new Map(menuItems.map((item) => [String(item._id), item]))

        const items = cartItems.map((item) => {
            const menuItem = itemMap.get(String(item?.id || item?._id || ""))
            if (!menuItem) return null
            return {
                itemId: menuItem._id,
                name: menuItem.name,
                image: menuItem.image,
                price: Number(menuItem.price),
                quantity: Number(item.quantity || 1),
            }
        }).filter(Boolean)

        const subtotal = items.reduce((sum, item) => sum + Number(item.price) * Number(item.quantity), 0)

        const savedCart = await Cart.findOneAndUpdate(
            { userId: req.userId },
            {
                userId: req.userId,
                outletId,
                items,
                subtotal,
            },
            { upsert: true, new: true }
        )

        return res.status(200).json(savedCart)
    } catch (err) {
        return res.status(500).json({ message: `sync cart error ${err.message || err}` })
    }
}

export const clearMyCart = async (req, res) => {
    try {
        await Cart.findOneAndDelete({ userId: req.userId })
        return res.status(200).json({ message: "cart cleared" })
    } catch (err) {
        return res.status(500).json({ message: `clear cart error ${err.message || err}` })
    }
}