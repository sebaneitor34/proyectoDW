import { config } from "dotenv";
config();

export const PORT = process.env.PORT || 4000;
export const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://sebastianvaras:sebaneitor34@cluster0.runjcec.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";