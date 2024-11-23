"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                "Suppliers",
                "new_id",
                {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: false,
                },
                { transaction }
            );

            const suppliers = await queryInterface.sequelize.query(
                `SELECT id FROM Suppliers`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            for (const supplier of suppliers) {
                await queryInterface.sequelize.query(
                    `UPDATE Suppliers SET new_id = UUID() WHERE id = ${supplier.id}`,
                    { transaction }
                );
            }

            await queryInterface.addColumn(
                "Products",
                "supplier_new_id",
                {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE Products
                SET supplier_new_id = (
                    SELECT new_id
                    FROM Suppliers
                    WHERE Suppliers.id = Products.supplier_id
                )
                `,
                { transaction }
            );

            await queryInterface.removeColumn("Products", "supplier_id", {
                transaction,
            });

            await queryInterface.renameColumn(
                "Products",
                "supplier_new_id",
                "supplier_id",
                {
                    transaction,
                }
            );

            await queryInterface.removeColumn("Suppliers", "id", {
                transaction,
            });

            await queryInterface.renameColumn("Suppliers", "new_id", "id", {
                transaction,
            });

            await queryInterface.changeColumn(
                "Suppliers",
                "id",
                {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: false,
                    primaryKey: true,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "Products",
                "supplier_id",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "Products",
                "supplier_id",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: "Suppliers",
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                { transaction }
            );

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.addColumn(
                "Suppliers",
                "old_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                { transaction }
            );

            const suppliers = await queryInterface.sequelize.query(
                `SELECT id FROM Suppliers`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            let counter = 1;
            for (const supplier of suppliers) {
                await queryInterface.sequelize.query(
                    `UPDATE Suppliers SET old_id = ${counter} WHERE id = '${supplier.id}'`,
                    { transaction }
                );
                counter++;
            }

            await queryInterface.addColumn(
                "Products",
                "supplier_old_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE Products
                SET supplier_old_id = (
                    SELECT old_id
                    FROM Suppliers
                    WHERE Suppliers.id = Products.supplier_id
                )
                `,
                { transaction }
            );

            await queryInterface.removeColumn("Products", "supplier_id", {
                transaction,
            });

            await queryInterface.renameColumn(
                "Products",
                "supplier_old_id",
                "supplier_id",
                {
                    transaction,
                }
            );

            await queryInterface.removeColumn("Suppliers", "id", {
                transaction,
            });
            await queryInterface.renameColumn("Suppliers", "old_id", "id", {
                transaction,
            });
            await queryInterface.changeColumn(
                "Suppliers",
                "id",
                {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "Products",
                "supplier_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Suppliers",
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                { transaction }
            );
        });
    },
};
