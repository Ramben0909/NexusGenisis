import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
// import queryRoutes from "./routes/queryRoutes.js";
// import insightRoutes from "./routes/insightRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
// app.use("/api/query", queryRoutes);
// app.use("/api/insight", insightRoutes);

export default app;
