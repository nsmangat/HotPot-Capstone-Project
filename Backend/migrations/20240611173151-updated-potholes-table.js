'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('potholes', 'description', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('potholes', 'address', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.addColumn('potholes', 'is_reported', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    });

    await queryInterface.renameColumn('potholes', 'location', 'coordinates');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('potholes', 'description');
    await queryInterface.removeColumn('potholes', 'address');
    await queryInterface.removeColumn('potholes', 'is_reported');
    await queryInterface.renameColumn('potholes', 'coordinates', 'location');
  }
};
