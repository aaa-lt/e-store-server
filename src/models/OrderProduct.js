import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Order from "./Order.js";
import Product from "./Product.js";

const OrderProduct = sequelize.define(
    "OrderProduct",
    {},
    { timestamps: false }
);

Order.belongsToMany(Product, { through: OrderProduct });
Product.belongsToMany(Order, { through: OrderProduct });

export default OrderProduct;
