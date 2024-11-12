"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Users", "user_type", {
            type: Sequelize.ENUM("regular", "google", "github"),
            allowNull: false,
            defaultValue: "regular",
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.changeColumn("Users", "user_type", {
            type: Sequelize.ENUM("regular", "google"),
            allowNull: false,
            defaultValue: "regular",
        });
    },
};
