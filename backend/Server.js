import dotenv from "dotenv";
import express from "express";
import connectDB from "./DB/db.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js'
import candidateRoutes from './routes/candidate.routes.js'
import leaveRoutes from './routes/leave.routes.js'

dotenv.config();

const app = express();
app.use(cookieParser());  
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());


connectDB();

app.use("/api/auth", authRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/leaves', leaveRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
