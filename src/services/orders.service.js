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
