"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Users", "password", {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn("Users", "user_type", {
            type: Sequelize.ENUM("regular", "google"),
            defaultValue: "regular",
            allowNull: false,
        });

        await queryInterface.addColumn("Users", "friendly_name", {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Users", "password", {
            type: Sequelize.STRING,
            allowNull: false,
        });

        await queryInterface.removeColumn("Users", "user_type");
        await queryInterface.removeColumn("Users", "friendly_name");
    },
};
