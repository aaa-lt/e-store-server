import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Category from "./Category.js";
import Supplier from "./Supplier.js";

const Product = sequelize.define(
    "Product",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        supplier_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        updatedAt: false,
        createdAt: "creation_date",
    }
);

Product.belongsTo(Category, { foreignKey: "category_id" });
Product.belongsTo(Supplier, { foreignKey: "supplier_id" });
Category.hasMany(Product, { foreignKey: "category_id" });
Supplier.hasMany(Product, { foreignKey: "supplier_id" });

export default Product;
