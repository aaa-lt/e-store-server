import OrderProduct from "../models/orderProduct.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import sequelize from "../../config/db.js";
import { metaCalc } from "../utils/pagination.utility.js";

export const getAllOrders = async (userId, reqQuery) => {
    const filterConditions = { user_id: userId };

    const includeArray = [
        {
            model: Product,
            attributes: ["id", "name", "price"],
            through: {
                attributes: ["quantity"],
            },
        },
    ];

    const count = await Order.count({
        where: filterConditions,
        include: includeArray,
        distinct: true,
    });

    const meta = metaCalc(count, reqQuery.page, reqQuery.limit);

    const orders = await Order.findAll({
        where: filterConditions,
        limit: meta.per_page,
        offset: (meta.current_page - 1) * meta.per_page,
        include: includeArray,
    });

    return {
        meta: meta,
        items: orders,
    };
};

export const getOrderById = async (id) => {
    return await Order.findOne({
        where: { id: id },
        include: [
            {
                model: Product,
                attributes: ["id", "name", "price", "image_url"],
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

            await Product.decrement(
                { quantity: element.quantity },
                {
                    where: { id: element.ProductId },
                    transaction,
                }
            );
        }
        await transaction.commit();
        return order.dataValues;
    } catch (error) {
        console.log(error);
        await transaction.rollback();
        return undefined;
    }
};
