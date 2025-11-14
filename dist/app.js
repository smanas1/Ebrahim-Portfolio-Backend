"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_routes_1 = require("./routes/user.routes");
const blog_routes_1 = require("./routes/blog.routes");
const product_routes_1 = require("./routes/product.routes");
const dashboard_routes_1 = require("./routes/dashboard.routes");
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// routes
app.use("/api/user", user_routes_1.userRoutes);
app.use("/api/blog", blog_routes_1.blogRouter);
app.use("/api/product", product_routes_1.productRouter);
app.use("/api/dashboard", dashboard_routes_1.dashboardRouter);
app.use("/api/contact", contact_routes_1.default);
app.get("/", (req, res) => {
    res.send("API is running...");
});
// connect DB
mongoose_1.default
    .connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
exports.default = app;
