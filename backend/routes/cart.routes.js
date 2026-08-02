import express from "express"
import { isAuth } from "../middlewares/isAuth.js"
import { clearMyCart, getMyCart, syncCart } from "../controllers/cart.controller.js"

const cartRouter = express.Router()

cartRouter.get("/my-cart", isAuth, getMyCart)
cartRouter.post("/sync", isAuth, syncCart)
cartRouter.delete("/clear", isAuth, clearMyCart)

export default cartRouter