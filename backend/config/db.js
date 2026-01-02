import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const connectdb = async () =>{
    try{
        await mongoose.connect(process.env.MONGOOSE_URL)
        console.log("dbconnect");

    }
    catch{
        console.log("db not connect")

    }
}

export default connectdb