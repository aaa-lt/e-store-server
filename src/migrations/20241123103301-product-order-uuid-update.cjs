"use strict";

const { DataTypes } = require("sequelize");

module.exports = {
    async up(queryInterface, Sequelize) {
        const transaction = await queryInterface.sequelize.transaction();
        try {
            await queryInterface.addColumn(
                "Products",
                "new_id",
                {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: false,
                },
                { transaction }
            );

            const products = await queryInterface.sequelize.query(
                `SELECT id FROM Products`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            for (const product of products) {
                await queryInterface.sequelize.query(
                    `UPDATE Products SET new_id = UUID() WHERE id = ${product.id}`,
                    { transaction }
                );
            }

            await queryInterface.addColumn(
                "Orders",
                "new_id",
                {
                    type: Sequelize.UUID,
                    defaultValue: Sequelize.UUIDV4,
                    allowNull: false,
                },
                { transaction }
            );

            const orders = await queryInterface.sequelize.query(
                `SELECT id FROM Orders`,
                { type: queryInterface.sequelize.QueryTypes.SELECT }
            );

            for (const order of orders) {
                await queryInterface.sequelize.query(
                    `UPDATE Orders SET new_id = UUID() WHERE id = ${order.id}`,
                    { transaction }
                );
            }

            await queryInterface.addColumn(
                "OrderProducts",
                "Product_new_Id",
                {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.addColumn(
                "OrderProducts",
                "Order_new_Id",
                {
                    type: DataTypes.UUID,
                    allowNull: true,
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE OrderProducts
                SET Product_new_Id = (
                    SELECT new_id
                    FROM Products
                    WHERE Products.id = OrderProducts.ProductId
                )
                `,
                { transaction }
            );

            await queryInterface.sequelize.query(
                `
                UPDATE OrderProducts
                SET Order_new_Id = (
                    SELECT new_id
                    FROM Orders
                    WHERE Orders.id = OrderProducts.OrderId
                )
                `,
                { transaction }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts DROP FOREIGN KEY OrderProducts_ibfk_1;`,
                { transaction }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts DROP FOREIGN KEY OrderProducts_ibfk_2;`,
                { transaction }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts DROP PRIMARY KEY;`,
                { transaction }
            );

            await queryInterface.removeColumn("OrderProducts", "ProductId", {
                transaction,
            });

            await queryInterface.removeColumn("OrderProducts", "OrderId", {
                transaction,
            });

            await queryInterface.renameColumn(
                "OrderProducts",
                "Product_new_Id",
                "ProductId",
                {
                    transaction,
                }
            );

            await queryInterface.renameColumn(
                "OrderProducts",
                "Order_new_Id",
                "OrderId",
                {
                    transaction,
                }
            );

            await queryInterface.removeColumn("Products", "id", {
                transaction,
            });

            await queryInterface.renameColumn("Products", "new_id", "id", {
                transaction,
            });

            await queryInterface.removeColumn("Orders", "id", {
                transaction,
            });

            await queryInterface.renameColumn("Orders", "new_id", "id", {
                transaction,
            });

            await queryInterface.changeColumn(
                "Products",
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
                "OrderProducts",
                "ProductId",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "OrderProducts",
                "OrderId",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "OrderProducts",
                "ProductId",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: "Products",
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                { transaction }
            );

            await queryInterface.changeColumn(
                "OrderProducts",
                "OrderId",
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    references: {
                        model: "Orders",
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                { transaction }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts ADD PRIMARY KEY (OrderId, ProductId)`,
                { transaction }
            );

            await queryInterface.addIndex("OrderProducts", ["ProductId"]);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    },

    async down(queryInterface, Sequelize) {
        console.log("Starting the 'down' migration...");

        await queryInterface.sequelize.transaction(async (transaction) => {
            const tablesToChange = ["Products", "Orders"];
            console.log(`Tables to modify: ${tablesToChange.join(", ")}`);

            for (const table of tablesToChange) {
                console.log(`Adding 'old_id' column to table: ${table}`);
                await queryInterface.addColumn(
                    table,
                    "old_id",
                    {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    { transaction }
                );

                console.log(`Fetching rows from table: ${table}`);
                const rows = await queryInterface.sequelize.query(
                    `SELECT id FROM ${table}`,
                    { type: queryInterface.sequelize.QueryTypes.SELECT }
                );

                console.log(`Updating 'old_id' for rows in table: ${table}`);
                let counter = 1;
                for (const row of rows) {
                    console.log(
                        `Updating row with id: ${row.id}, setting old_id to: ${counter}`
                    );
                    await queryInterface.sequelize.query(
                        `UPDATE ${table} SET old_id = ${counter} WHERE id = '${row.id}'`,
                        { transaction }
                    );
                    counter++;
                }
            }

            console.log(
                "Adding 'Product_old_Id' column to 'OrderProducts' table."
            );
            await queryInterface.addColumn(
                "OrderProducts",
                "Product_old_Id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction }
            );

            console.log(
                "Populating 'Product_old_Id' column in 'OrderProducts' table."
            );
            await queryInterface.sequelize.query(
                `
            UPDATE OrderProducts
            SET Product_old_Id = (
                SELECT old_id
                FROM Products
                WHERE Products.id = OrderProducts.ProductId
            )
            `,
                { transaction }
            );

            console.log(
                "Adding 'Order_old_Id' column to 'OrderProducts' table."
            );
            await queryInterface.addColumn(
                "OrderProducts",
                "Order_old_Id",
                {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                { transaction }
            );

            console.log(
                "Populating 'Order_old_Id' column in 'OrderProducts' table."
            );
            await queryInterface.sequelize.query(
                `
            UPDATE OrderProducts
            SET Order_old_Id = (
                SELECT old_id
                FROM Orders
                WHERE Orders.id = OrderProducts.OrderId
            )
            `,
                { transaction }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts DROP FOREIGN KEY OrderProducts_ibfk_1;`,
                { transaction }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts DROP FOREIGN KEY OrderProducts_ibfk_2;`,
                { transaction }
            );

            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts DROP PRIMARY KEY;`,
                { transaction }
            );

            console.log(
                "Removing 'ProductId' column from 'OrderProducts' table."
            );
            await queryInterface.removeColumn("OrderProducts", "ProductId", {
                transaction,
            });

            console.log(
                "Removing 'OrderId' column from 'OrderProducts' table."
            );

            await queryInterface.removeColumn("OrderProducts", "OrderId", {
                transaction,
            });

            console.log(
                "Renaming 'Product_old_Id' to 'ProductId' in 'OrderProducts' table."
            );
            await queryInterface.renameColumn(
                "OrderProducts",
                "Product_old_Id",
                "ProductId",
                {
                    transaction,
                }
            );

            console.log(
                "Renaming 'Order_old_Id' to 'OrderId' in 'OrderProducts' table."
            );
            await queryInterface.renameColumn(
                "OrderProducts",
                "Order_old_Id",
                "OrderId",
                {
                    transaction,
                }
            );

            for (const table of tablesToChange) {
                console.log(`Removing 'id' column from table: ${table}`);
                await queryInterface.removeColumn(table, "id", {
                    transaction,
                });

                console.log(`Renaming 'old_id' to 'id' in table: ${table}`);
                await queryInterface.renameColumn(table, "old_id", "id", {
                    transaction,
                });

                console.log(
                    `Changing 'id' column to auto-increment primary key in table: ${table}`
                );
                await queryInterface.changeColumn(
                    table,
                    "id",
                    {
                        type: Sequelize.INTEGER,
                        autoIncrement: true,
                        primaryKey: true,
                    },
                    { transaction }
                );
            }

            console.log(
                "Updating foreign key reference for 'ProductId' in 'OrderProducts' table."
            );
            await queryInterface.changeColumn(
                "OrderProducts",
                "ProductId",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Products",
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                { transaction }
            );

            console.log(
                "Updating foreign key reference for 'OrderId' in 'OrderProducts' table."
            );
            await queryInterface.changeColumn(
                "OrderProducts",
                "OrderId",
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: "Orders",
                        key: "id",
                    },
                    onUpdate: "CASCADE",
                    onDelete: "CASCADE",
                },
                { transaction }
            );

            console.log(
                "Adding composite primary key on 'OrderId' and 'ProductId' in 'OrderProducts' table."
            );
            await queryInterface.sequelize.query(
                `ALTER TABLE OrderProducts ADD PRIMARY KEY (OrderId, ProductId)`,
                { transaction }
            );

            console.log(
                "Adding index on 'ProductId' in 'OrderProducts' table."
            );
            await queryInterface.addIndex("OrderProducts", ["ProductId"]);
        });

        console.log("Migration 'down' completed successfully.");
    },
};
