"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("reports", {
      report_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      pothole_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "potholes",
          key: "pothole_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      firebase_uid: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "firebase_uid",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      time_reported: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("reports");
  },
};
