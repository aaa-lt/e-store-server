import { Router } from "express";
import verifyToken from "../middleware/authMiddleware.js";
import isAdmin from "../middleware/adminMiddleware.js";
import OrderProduct from "../models/OrderProduct.js";
import Order from "../models/Order.js";
import { or } from "sequelize";

const router = Router();

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

router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const { status } = req.body;
        if (Order.getAttributes().status.values.includes(status)) {
            const order = await Order.findByPk(req.params.id);
            order.update({ status: status });

            return res.status(201).json({
                status: "success",
                message: "Order updated successfully",
            });
        }
        return res.status(201).json({
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
