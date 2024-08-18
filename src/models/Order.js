import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import User from "./User.js";

const Order = sequelize.define(
    "Order",
    {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
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
    {
        timestamps: true,
        updatedAt: false,
        createdAt: "order_date",
    }
);

Order.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Order, { foreignKey: "user_id" });

export default Order;
