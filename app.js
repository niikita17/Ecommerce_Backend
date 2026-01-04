import dotenv from "dotenv";
dotenv.config();
import express from "express";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import productRoutes from "./routes/productRoutes.js" ;
import orderRoutes from "./routes/orderRoutes.js";
import userRoutes from"./routes/userRoutes.js";
import cartRoutes from"./routes/cartRoutes.js";
import paymentRoutes from"./routes/paymentRoutes.js";

const app = express();
connectDB();

app.use(express.json());



app.get("/", (req, res) => {
  res.send("E-commerce Backend API running 🚀");
});

app.use("/auth", authRoutes);

app.use("/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/user", userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
