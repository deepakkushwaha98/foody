import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import userRouter from "./routes/user.routes.js";
import shopRouter from "./routes/shop.routes.js";
import itemRouter from "./routes/item.routes.js";
import orderRouter from "./routes/order.routes.js";
import adminRouter from "./routes/admin.routes.js";
import http, { Server } from "http"
import { Server as SocketServer } from "socket.io"
import { socketHandler } from "./socket.js";



dotenv.config({ path: "./.env" });
const app = express()

const server = http.createServer(app)

const io = new SocketServer(server , {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
        methods:["GET" , "POST"]
    }
})

app.set("io" , io)



















app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}))
const port = process.env.PORT || 3000;



app.use(express.json())
app.use(cookieParser())
app.use("/api/auth" ,authRouter)
app.use("/api/user" ,userRouter)
app.use("/api/item" ,itemRouter)
app.use("/api/shop" ,shopRouter)
app.use("/api/order" , orderRouter)

socketHandler(io)

server.listen(port , ()=>{
    connectdb()
    console.log(`${port}`)
})


export {app}