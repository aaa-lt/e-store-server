import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import Category from "../models/Category.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const categories = await Category.findAll();
        res.status(200).send(categories);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, description } = req.body;
        const existingName = await Category.findOne({
            where: { name: name },
        });
        if (existingName)
            return res.status(409).json({
                status: "failed",
                error: "Category with this name is already exists",
            });
        await Category.create({
            name: name,
            description: description,
        });
        res.status(201).json({
            status: "success",
            message: "Category created successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Registration failed",
        });
    }
});

export default router;
