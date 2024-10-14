import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Order from "./order.js";
import Product from "./product.js";

const OrderProduct = sequelize.define(
    "OrderProduct",
    {
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
    },
    { timestamps: false }
);

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

export default OrderProduct;
