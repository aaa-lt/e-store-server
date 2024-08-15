import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Product from "./Product.js";
import User from "./User.js";

const Order = sequelize.define(
    "Order",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        quantity: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.ENUM(
                "Pending",
                "Shipped",
                "Delivered",
                "Cancelled"
            ),
            allowNull: false,
            defaultValue: "Pending",
        },
    },
    { timestamps: false }
);

Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

export default Order;
