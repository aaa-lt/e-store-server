"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Suppliers", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            contact_email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            phone_number: {
                type: Sequelize.STRING,
                unique: true,
            },
        });
        await queryInterface.addIndex("Suppliers", ["name"], { unique: false });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("Suppliers");
    },
};
