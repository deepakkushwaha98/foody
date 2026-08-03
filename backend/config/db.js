import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectdb = async () => {
    try {
        await mongoose.connect(process.env.MONGOOSE_URL);
        console.log("db connected");
    } catch (err) {
        console.error("DB connection error:", err);
        throw err;
    }
};

export default connectdb