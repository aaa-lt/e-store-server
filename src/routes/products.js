import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import Product from "../models/Product.js";

const router = Router();

/**
 * @openapi
 * '/products':
 *  get:
 *     tags:
 *     - Product Controller
 *     summary: Get products
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

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

/**
 * @openapi
 * '/products/{id}':
 *   get:
 *     tags:
 *       - Product Controller
 *     summary: Get details of a specific product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to get
 *     responses:
 *       200:
 *         description: Fetched Successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server Error
 */

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

/**
 * @openapi
 * '/products':
 *  post:
 *     tags:
 *     - Product Controller
 *     summary: Create a product
 *     security:
 *     - Authorization: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               price:
 *                 type: number
 *                 format: float
 *               category_id:
 *                 type: integer
 *               supplier_id:
 *                 type: integer
 *             required:
 *               - name
 *               - quantity
 *               - price
 *               - category_id
 *               - supplier_id
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

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

/**
 * @openapi
 * '/products/{id}':
 *  put:
 *     tags:
 *     - Product Controller
 *     summary: Update the product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to update
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                default: any
 *              description:
 *                type: string
 *                default: any
 *              quantity:
 *                type: integer
 *                default: 1
 *              price:
 *                type: integer
 *                default: 0
 *              category_id:
 *                type: integer
 *                default: 1
 *              supplier_id:
 *                type: integer
 *                default: 1
 *
 *
 *     responses:
 *      200:
 *        description: Updated
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const updates = {};

        const fields = [
            "name",
            "description",
            "quantity",
            "price",
            "category_id",
            "supplier_id",
        ];

        fields.forEach((field) => {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        });

        const product = await Product.findByPk(req.params.id);

        if (product) {
            await product.update(updates);

            return res.status(200).json({
                status: "success",
                message: "Product updated successfully",
            });
        }

        return res.status(400).json({
            status: "failed",
            message: "Invalid ID",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            error: "Putting failed",
        });
    }
});

/**
 * @openapi
 * '/products/{id}':
 *   delete:
 *     tags:
 *       - Product Controller
 *     summary: Delete product
 *     security:
 *       - Authorization: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the product to delete
 *     responses:
 *       200:
 *         description: Deleted Successfully
 *       404:
 *         description: Not found
 *       500:
 *         description: Server Error
 */

router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const product = await Product.findOne({ where: { id: req.params.id } });
        if (product) {
            product.destroy();
            return res.status(200).json({
                status: "success",
                error: "Product deleted",
            });
        }
        return res.status(404).send("Not found");
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to delete product",
        });
    }
});

export default router;
