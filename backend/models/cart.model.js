import mongoose from "mongoose"

const cartItemSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true,
    },
    name: String,
    image: String,
    price: Number,
    quantity: Number,
}, { timestamps: true })

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },
    outletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Shop",
        default: null,
    },
    items: [cartItemSchema],
    subtotal: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

const Cart = mongoose.model("Cart", cartSchema)

export default Cart
