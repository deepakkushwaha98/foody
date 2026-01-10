import express from "express"
import { isAuth } from "../middlewares/isAuth.js"

import { addItem, deleteItem, editItem, getItemByCity, getItemByID } from "../controllers/item.controller.js"
import { upload } from "../middlewares/multer.js"
const itemRouter = express.Router()

itemRouter.post("/add-item", isAuth, upload.single("image"), addItem)

itemRouter.put("/edit-item/:itemId", isAuth, upload.single("image"), editItem)

itemRouter.get("/get-by-id/:itemId", isAuth, getItemByID)
itemRouter.get("/delete/:itemid" , isAuth , deleteItem)
itemRouter.get("/get-by-city/:city" , isAuth , getItemByCity)


export default itemRouter