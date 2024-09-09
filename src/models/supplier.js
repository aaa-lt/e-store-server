import { DataTypes } from "sequelize";
import sequelize from "../../config/db.js";

const Supplier = sequelize.define(
    "Supplier",
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
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
    { timestamps: false, indexes: [{ unique: false, fields: ["name"] }] }
);

Supplier.beforeDestroy(async (supplier, options) => {
    await Product.destroy({
        where: { supplier_id: supplier.id },
        transaction: options.transaction,
    });
});

export default Supplier;
