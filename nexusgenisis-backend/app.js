import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import { requestLogger } from "./middlewares/loggerMiddleware.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(requestLogger);

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Nexus Genesis Backend is running");
});

export default app;
