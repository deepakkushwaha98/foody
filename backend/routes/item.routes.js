import express from "express"
import { isAuth } from "../middlewares/isAuth.js"

import { addItem, deleteItem, searchItems,getItemsByShop , editItem, getItemByCity, getItemByID, getAllItems } from "../controllers/item.controller.js"
import { upload } from "../middlewares/multer.js"
const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem)

itemRouter.put("/edit-item/:itemId", isAuth, upload.single("image"), editItem)

itemRouter.get("/get-by-id/:itemId", isAuth, getItemByID)
itemRouter.get("/delete/:itemid" , isAuth , deleteItem)
// Allow unauthenticated users to browse items by city
itemRouter.get("/get-by-city/:city" , getItemByCity)
itemRouter.get("/get-by-shop/:shopId" , isAuth , getItemsByShop)
itemRouter.get("/all" , getAllItems) // debug
itemRouter.get("/search-items" , isAuth,searchItems)

export default itemRouter