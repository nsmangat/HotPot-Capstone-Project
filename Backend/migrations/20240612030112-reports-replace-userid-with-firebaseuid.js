"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the firebase_uid column to the reports table
    await queryInterface.addColumn("reports", "firebase_uid", {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "firebase_uid",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn("reports", "user_id");
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("reports", "user_id", {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    });

    await queryInterface.removeColumn("reports", "firebase_uid");
  },
};
