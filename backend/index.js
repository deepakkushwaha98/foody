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
import cartRouter from "./routes/cart.routes.js";
import couponRouter from "./routes/coupon.routes.js";
import adminRouter from "./routes/admin.routes.js";
import http, { Server } from "http"
import { Server as SocketServer } from "socket.io"
import { socketHandler } from "./socket.js";



dotenv.config({ path: new URL("./.env", import.meta.url).pathname });
const app = express()

app.get("/", (req, res) => {
  res.send("----Foody backend is running successfully----");
});

const server = http.createServer(app)

// Define allowed origins for CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://foody-kxvt.onrender.com",
  "http://localhost:5173",
  "http://localhost:3000"
];

const io = new SocketServer(server , {
    cors: {
        origin: (origin, callback) => {
          if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
        methods:["GET" , "POST"]
    }
})

app.set("io" , io)

app.use(cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
}))
const port = Number(process.env.PORT) || 3000;

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth" ,authRouter)
app.use("/api/user" ,userRouter)
app.use("/api/item" ,itemRouter)
app.use("/api/shop" ,shopRouter)
app.use("/api/cart" , cartRouter)
app.use("/api/coupon" , couponRouter)
app.use("/api/order" , orderRouter)
app.use("/api/orders" , orderRouter)
app.use("/api/admin" , adminRouter)

socketHandler(io)

const startListening = (currentPort, attempt = 0) => {
    const onError = (err) => {
        if (err.code === "EADDRINUSE" && attempt < 5) {
            const fallbackPort = currentPort + 1;
            console.warn(`Port ${currentPort} is busy. Trying ${fallbackPort} instead.`);
            server.off("error", onError);
            startListening(fallbackPort, attempt + 1);
            return;
        }

        console.error("Server startup failed:", err);
        process.exit(1);
    };

    server.once("error", onError);
    server.listen(currentPort, () => {
        server.off("error", onError);
        console.log(`Server running on port ${currentPort}`);
    });
};

const startServer = async () => {
    try {
        await connectdb();
        startListening(port);
    } catch (err) {
        console.error("Server startup failed:", err);
        process.exit(1);
    }
};

startServer();

export {app}
