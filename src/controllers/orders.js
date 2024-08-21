import OrderProduct from "../models/OrderProduct.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sequelize from "../../config/db.js";

const gerOrders = async (req, res) => {
    try {
        const orders = await Order.findAll();
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const order = await Order.findOne({
            where: { id: req.params.id },
            include: [
                {
                    model: Product,
                    attributes: ["id", "name"],
                    through: {
                        attributes: ["quantity"],
                    },
                },
            ],
        });
        if (order) {
            return res.status(200).send(order);
        }
        return res.status(404).send("Not found");
    } catch (error) {
        res.status(500).json({
            status: "failed",
            error: "Failed to get information",
        });
    }
};

const createOrder = async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { products } = req.body;
        if (products && products.length > 0) {
            const order = await Order.create(
                {
                    user_id: req.userId,
                    status: "Pending",
                },
                { transaction }
            );
            console.log(order);
            for (const element of products) {
                await OrderProduct.create(
                    {
                        OrderId: order.id,
                        ProductId: element.ProductId,
                        quantity: element.quantity,
                    },
                    { transaction }
                );
            }

            await transaction.commit();

            return res.status(201).json({
                status: "success",
                message: "Order created successfully",
            });
        }

        await transaction.rollback();
        return res.status(400).json({
            status: "failed",
            message: "No products provided",
        });
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return res.status(500).json({
            status: "failed",
            error: "Creation failed",
        });
    }
};

const putOrder = async (req, res) => {
    try {
        const { status } = req.body;
        if (Order.getAttributes().status.values.includes(status)) {
            const order = await Order.findByPk(req.params.id);
            if (order) {
                await order.update({ status: status });

                return res.status(200).json({
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
        return res.status(500).json({
            status: "failed",
            error: "Putting failed",
        });
    }
};

export default { gerOrders, getOrder, createOrder, putOrder };
