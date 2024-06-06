"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // If dummy user already exists, do not insert
    const existingUser = await queryInterface.rawSelect(
      "users",
      {
        where: { email: "test@example.com" },
      },
      ["id"]
    );

    if (!existingUser) {
      await queryInterface.bulkInsert("users", [
        {
          firebase_uid: "test_firebase_uid",
          email: "test@example.com",
          phone_number: "123-456-789",
          first_name: "first",
          last_name: "last",
          password: "abcd",
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    } else {
      console.log("Test user already exists. Skipping insertion.");
    }

    // If dummy pothole already exists, skip inserting
    const existingPothole = await queryInterface.rawSelect(
      "potholes",
      {
        where: { location: "dummy_location" },
      },
      ["id"]
    );

    if (!existingPothole) {
      await queryInterface.bulkInsert("potholes", [
        {
          pothole_size: "small",
          first_reported_date: new Date(),
          number_of_reports: 1,
          location: "dummy_location",
          is_fixed: false,
          updated_at: new Date(),
        },
      ]);
    } else {
      console.log("Test pothole already exists. Skipping insertion.");
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", { email: "test@example.com" });
    await queryInterface.bulkDelete("potholes", { location: "dummy_location" });
  },
};
