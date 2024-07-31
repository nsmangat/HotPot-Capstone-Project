'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('potholes', 'estimated_fix_date', {
      type: Sequelize.DATE,
      allowNull: true,
    });

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('potholes', 'estimated_fix_date');
  }
};