"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn("Users", "phone_number", {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn("Users", "age", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });

        await queryInterface.addColumn("Users", "delivery_address", {
            type: Sequelize.TEXT,
            allowNull: true,
        });

        await queryInterface.addColumn("Users", "preferred_payment_method", {
            type: Sequelize.ENUM("credit_card", "paypal", "bank_transfer"),
            allowNull: true,
        });
        await queryInterface.addColumn("Users", "newsletter_opt_in", {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn("Users", "phone_number");
        await queryInterface.removeColumn("Users", "age");
        await queryInterface.removeColumn("Users", "delivery_address");
        await queryInterface.removeColumn("Users", "preferred_payment_method");
        await queryInterface.removeColumn("Users", "newsletter_opt_in");
    },
};
