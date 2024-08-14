import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Category from "./category.js";
import Supplier from "./supplier.js";

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

Product.belongsTo(Category, { foreignKey: "categoryId" });
Product.belongsTo(Supplier, { foreignKey: "supplierId" });
Category.hasMany(Product, { foreignKey: "categoryId" });
Supplier.hasMany(Product, { foreignKey: "supplierId" });

// TODO finished at product model

export default Product;
