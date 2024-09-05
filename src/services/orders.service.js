import OrderProduct from "../models/OrderProduct.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sequelize from "../../config/db.js";

export const getAllOrders = async () => {
    return await Order.findAll();
};

export const getOrderById = async (id) => {
    return await Order.findOne({
        where: { id: id },
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
};

export const createOrderService = async (userId, products) => {
    const transaction = await sequelize.transaction();

    try {
        const order = await Order.create(
            {
                user_id: userId,
                status: "Pending",
            },
            { transaction }
        );
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
        return order.dataValues;
    } catch (error) {
        await transaction.rollback();
        return undefined;
    }
};
