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

Category.beforeDestroy(async (category, options) => {
    await Product.update(
        { category_id: null },
        {
            where: { category_id: category.id },
            transaction: options.transaction,
        }
    );
});

export default Category;
