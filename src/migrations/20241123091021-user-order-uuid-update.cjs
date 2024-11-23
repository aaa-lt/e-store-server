"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                "Users",
                "new_id",
                {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: false,
                },
                { transaction }
            );

            const users = await queryInterface.sequelize.query(
                `SELECT id FROM Users`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            for (const user of users) {
                await queryInterface.sequelize.query(
                    `UPDATE Users SET new_id = UUID() WHERE id = ${user.id}`,
                    { transaction }
                );
            }

            await queryInterface.addColumn(
                "Orders",
                "user_new_id",
                {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE Orders
                SET user_new_id = (
                    SELECT new_id
                    FROM Users
                    WHERE Users.id = Orders.user_id
                )
                `,
                { transaction }
            );

            await queryInterface.removeColumn("Orders", "user_id", {
                transaction,
            });

            await queryInterface.renameColumn(
                "Orders",
                "user_new_id",
                "user_id",
                {
                    transaction,
                }
            );

            await queryInterface.removeColumn("Users", "id", {
                transaction,
            });

            await queryInterface.renameColumn("Users", "new_id", "id", {
                transaction,
            });

            await queryInterface.changeColumn(
                "Users",
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
                "Orders",
                "user_id",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "Orders",
                "user_id",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: "Users",
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
                "Users",
                "old_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                },
                { transaction }
            );

            const users = await queryInterface.sequelize.query(
                `SELECT id FROM Users`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            let counter = 1;
            for (const user of users) {
                await queryInterface.sequelize.query(
                    `UPDATE Users SET old_id = ${counter} WHERE id = '${user.id}'`,
                    { transaction }
                );
                counter++;
            }

            await queryInterface.addColumn(
                "Orders",
                "user_old_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE Orders
                SET user_old_id = (
                    SELECT old_id
                    FROM Users
                    WHERE Users.id = Orders.user_id
                )
                `,
                { transaction }
            );

            await queryInterface.removeColumn("Orders", "user_id", {
                transaction,
            });

            await queryInterface.renameColumn(
                "Orders",
                "user_old_id",
                "user_id",
                {
                    transaction,
                }
            );

            await queryInterface.removeColumn("Users", "id", { transaction });
            await queryInterface.renameColumn("Users", "old_id", "id", {
                transaction,
            });
            await queryInterface.changeColumn(
                "Users",
                "id",
                {
                    type: Sequelize.INTEGER,
                    autoIncrement: true,
                    primaryKey: true,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "Orders",
                "user_id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Users",
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
