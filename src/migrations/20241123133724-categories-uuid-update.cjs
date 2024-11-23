"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                "Categories",
                "new_id",
                {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: false,
                },
                { transaction }
            );

            const categories = await queryInterface.sequelize.query(
                `SELECT id FROM Categories`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            for (const category of categories) {
                await queryInterface.sequelize.query(
                    `UPDATE Categories SET new_id = UUID() WHERE id = ${category.id}`,
                    { transaction }
                );
            }

            await queryInterface.addColumn(
                "Products",
                "category_new_id",
                {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE Products
                SET category_new_id = (
                    SELECT new_id
                    FROM Categories
                    WHERE Categories.id = Products.category_id
                )
                `,
                { transaction }
            );

            await queryInterface.removeColumn("Products", "category_id", {
                transaction,
            });

            await queryInterface.renameColumn(
                "Products",
                "category_new_id",
                "category_id",
                {
                    transaction,
                }
            );

            await queryInterface.removeColumn("Categories", "id", {
                transaction,
            });

            await queryInterface.renameColumn("Categories", "new_id", "id", {
                transaction,
            });

            await queryInterface.changeColumn(
                "Categories",
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
                "category_id",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "Products",
                "category_id",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: "Categories",
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
                "Categories",
                "old_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                { transaction }
            );

            const categories = await queryInterface.sequelize.query(
                `SELECT id FROM Categories`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            let counter = 1;
            for (const category of categories) {
                await queryInterface.sequelize.query(
                    `UPDATE Categories SET old_id = ${counter} WHERE id = '${category.id}'`,
                    { transaction }
                );
                counter++;
            }

            await queryInterface.addColumn(
                "Products",
                "category_old_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE Products
                SET category_old_id = (
                    SELECT old_id
                    FROM Categories
                    WHERE Categories.id = Products.category_id
                )
                `,
                { transaction }
            );

            await queryInterface.removeColumn("Products", "category_id", {
                transaction,
            });

            await queryInterface.renameColumn(
                "Products",
                "category_old_id",
                "category_id",
                {
                    transaction,
                }
            );

            await queryInterface.removeColumn("Categories", "id", {
                transaction,
            });
            await queryInterface.renameColumn("Categories", "old_id", "id", {
                transaction,
            });
            await queryInterface.changeColumn(
                "Categories",
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
                "category_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Categories",
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
