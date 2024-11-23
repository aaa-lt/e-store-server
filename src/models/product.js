import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";
import Category from "./category.js";
import Supplier from "./supplier.js";

const Product = sequelize.define(
    "Product",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
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
            defaultValue: 0,
        },
        price: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        category_id: {
            type: DataTypes.INTEGER,
        },
        supplier_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        timestamps: true,
        updatedAt: false,
        createdAt: "creation_date",
        indexes: [
            {
                unique: false,
                fields: ["name", "price"],
            },
        ],
    }
);

Product.belongsTo(Category, { foreignKey: "category_id" });
Product.belongsTo(Supplier, { foreignKey: "supplier_id" });
Category.hasMany(Product, { foreignKey: "category_id" });
Supplier.hasMany(Product, { foreignKey: "supplier_id" });

export default Product;
