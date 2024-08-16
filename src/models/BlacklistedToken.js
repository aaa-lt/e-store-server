import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const BlacklistedToken = sequelize.define(
    "Category",
    {
        token: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    { timestamps: false }
);

export default BlacklistedToken;
