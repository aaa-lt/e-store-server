"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("OrderProducts", {
            quantity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            OrderId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Orders",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                primaryKey: true,
            },
            ProductId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: "Products",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE",
                primaryKey: true,
            },
        });

        await queryInterface.addIndex("OrderProducts", ["ProductId"]);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("OrderProducts");
    },
};
