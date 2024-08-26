import { Router } from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./users.route.js";
import categoriesRoutes from "./categories.route.js";
import suppliersRoutes from "./suppliers.route.js";
import orderRoutes from "./orders.route.js";
import productRoutes from "./products.route.js";
import searchRoutes from "./search.route.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", suppliersRoutes);
router.use("/orders", orderRoutes);
router.use("/products", productRoutes);
router.use("/search", searchRoutes);

export default router;
