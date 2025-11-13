import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { userRoutes } from "./routes/user.routes";
import { blogRouter } from "./routes/blog.routes";
import { productRouter } from "./routes/product.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import contactRoutes from "./routes/contact.routes";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

// routes

app.use("/api/user", userRoutes);
app.use("/api/blog", blogRouter);
app.use("/api/product", productRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/contact", contactRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});
// connect DB
mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

export default app;
