import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import OrderProduct from "../models/OrderProduct.js";
import Order from "../models/Order.js";

const router = Router();

/**
 * @openapi
 * '/orders':
 *  get:
 *     tags:
 *     - Order Controller
 *     summary: Get orders
 *     security:
 *     - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      500:
 *        description: Server Error
 */

router.get("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
});

/**
 * @openapi
 * '/orders/{id}':
 *  get:
 *     tags:
 *     - Order Controller
 *     summary: Get specified order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the order to get
 *     security:
 *       - Authorization: []
 *     responses:
 *      200:
 *        description: Fetched Successfully
 *      404:
 *        description: Not found
 *      500:
 *        description: Server Error
 */

router.get("/:id", verifyToken, async (req, res) => {
    try {
        const order = await Order.findOne({ where: { id: req.params.id } });
        if (order) {
            const data = await OrderProduct.findAll({
                where: { orderId: req.params.id },
            });
            order.dataValues.products = [];
            for (const element of data) {
                const dataSection = {
                    ProductId: element.ProductId,
                    quantity: element.quantity,
                };
                order.dataValues.products.push(dataSection);
            }

            return res.status(200).send(order);
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
 * '/orders':
 *  post:
 *     tags:
 *     - Order Controller
 *     summary: Create an order
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - products
 *            properties:
 *              products:
 *                type: array
 *                default: ["ProductId": 1, "quantity": "1"]
 *     responses:
 *      201:
 *        description: Created
 *      409:
 *        description: Conflict
 *      500:
 *        description: Server Error
 */

router.post("/", verifyToken, async (req, res) => {
    try {
        const { products } = req.body;
        if (products) {
            const order = await Order.create({
                user_id: req.userId,
                status: "Pending",
            });
            for (const element of products) {
                await OrderProduct.create({
                    OrderId: order.id,
                    ProductId: element.ProductId,
                    quantity: element.quantity,
                });
            }
        }

        return res.status(201).json({
            status: "success",
            message: "Order created successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            error: "Creation failed",
        });
    }
});

/**
 * @openapi
 * '/orders/{id}':
 *  put:
 *     tags:
 *     - Order Controller
 *     summary: Change status of an order
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the order to put
 *     security:
 *       - Authorization: []
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *            type: object
 *            required:
 *              - products
 *            properties:
 *              status:
 *                type: string
 *                enum: [Pending, Shipped, Delivered, Cancelled]
 *     responses:
 *      201:
 *        description: Updated
 *      400:
 *        description: Bad request
 *      500:
 *        description: Server Error
 */

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (Order.getAttributes().status.values.includes(status)) {
            const order = await Order.findByPk(req.params.id);
            if (order) {
                order.update({ status: status });

                return res.status(201).json({
                    status: "success",
                    message: "Order updated successfully",
                });
            }

            return res.status(400).json({
                status: "failed",
                message: "Invalid ID",
            });
        }
        return res.status(400).json({
            status: "failed",
            message: "Invalid status",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "failed",
            error: "Putting failed",
        });
    }
});

export default router;
