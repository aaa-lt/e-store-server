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
            type: DataTypes.TEXT,
        },
        price: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    { timestamps: true }
);

Product.belongsTo(Category, { foreignKey: "category_id" });
Product.belongsTo(Supplier, { foreignKey: "supplier_id" });
Category.hasMany(Product, { foreignKey: "category_id" });
Supplier.hasMany(Product, { foreignKey: "supplier_id" });

export default Product;
