import express from "express"
import dotenv from "dotenv"
import connectdb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import cors from "cors"
import userRouter from "./routes/user.routes.js";


dotenv.config({ path: "./.env" });
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}))
const port = process.env.PORT || 3000;



app.use(express.json())
app.use(cookieParser())
app.use("/api/auth" ,authRouter)
app.use("/api/user" ,userRouter)

app.listen(port , ()=>{
    connectdb()
    console.log(`${port}`)
})

export {app}