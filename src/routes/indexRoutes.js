import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import categoriesRoutes from "./categories.js";
import suppliersRoutes from "./suppliers.js";
import orderRoutes from "./orders.js";
import productRoutes from "./products.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);

export default router;
