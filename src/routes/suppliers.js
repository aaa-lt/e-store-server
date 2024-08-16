import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import Supplier from "../models/Supplier.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const categories = await Supplier.findAll();
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
        const existingName = await Supplier.findOne({
            where: { name: name },
        });
        if (existingName)
            return res.status(409).json({
                status: "failed",
                error: "Supplier with this name is already exists",
            });
        await Supplier.create({
            name: name,
            description: description,
        });
        res.status(201).json({
            status: "success",
            message: "Supplier created successfully",
        });
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Registration failed",
        });
    }
});

export default router;
