import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Supplier = sequelize.define(
    "Supplier",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password_hash: {
            type: DataTypes.STRING,
        },
        contact_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        phone_number: {
            type: DataTypes.STRING,
            unique: true,
        },
    },
    { timestamps: false }
);

export default Supplier;
