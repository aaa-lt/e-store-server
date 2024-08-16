import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Category = sequelize.define(
    "Category",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
        },
    },
    { timestamps: false }
);

export default Category;
