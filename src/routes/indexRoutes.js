import { Router } from "express";
import authRoutes from "./auth.js";
import userRoutes from "./users.js";
import categoriesRoutes from "./categories.js";
import suppliersRoutes from "./suppliers.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/categories", categoriesRoutes);
router.use("/suppliers", suppliersRoutes);

export default router;
