import {
    getAllOrders,
    getOrderById,
    createOrderService,
} from "../services/orders.service.js";
import { getProductById } from "../services/products.service.js";
getProductById;
import Product from "../models/Product.js";

const getOrdersController = async (req, res) => {
    try {
        res.status(200).send(await getAllOrders());
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await getOrderById(req.params.id);
        if (order) {
            return res.status(200).send(order);
        }
        return res.status(404).send("Not found");
    } catch (error) {
        res.status(500).json({
            status: "error",
            error: "Failed to get information",
        });
    }
};

const createOrderController = async (req, res) => {
    try {
        for (const element of req.body.products) {
            const product = await getProductById(element.ProductId);
            if (element.quantity > product.quantity) {
                return res.status(400).json({
                    status: "error",
                    message: "Not enough products available",
                });
            }
        }

        const order = await createOrderService(req.userId, req.body.products);
        if (!order) {
            return res.status(400).json({
                status: "error",
                message: "Invalid products provided",
            });
        }
        return res.status(201).json({
            status: "success",
            message: "Order created successfully",
            data: order,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: "error",
            error: "Creation failed",
        });
    }
};

const putOrder = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await getOrderById(req.params.id);
        if (!order) {
            return res.status(400).json({
                status: "error",
                message: "Invalid ID",
            });
        }
        await order.update({ status: status });

        return res.status(200).json({
            status: "success",
            message: "Order updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            error: "Putting failed",
        });
    }
};

export default {
    getOrdersController,
    getOrder,
    createOrderController,
    putOrder,
};
