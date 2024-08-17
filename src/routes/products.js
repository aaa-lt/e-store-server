import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import Product from "../models/Product.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const filter = req.query.filter;
        if (filter === "category" || filter === "supplier") {
            const products = await Product.findAll({
                order: [[filter + "_id"]],
            });
            return res.status(200).send(products);
        }
        const products = await Product.findAll();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id } });
        if (product) {
            return res.status(200).send(product);
        }
        return res.status(404).send("Not found");
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
});

router.post("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const { name, description, quantity, price, category_id, supplier_id } =
            req.body;
        await Product.create({
            name: name,
            description: description,
            quantity: quantity,
            price: price,
            category_id: category_id,
            supplier_id: supplier_id,
        });
        return res.status(201).json({
            status: "success",
            message: "Product created successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "failed",
            error: "Creation failed",
        });
    }
});

export default router;
