// Script to initialize the DB
// locally run 'node dbsetup.js'

const { Sequelize } = require("sequelize");
const sequelize = require("./sequalize");

const Pothole = require("./models/pothole");
const User = require("./models/user");

async function setupDatabase() {
  try {
    // False so that it won't drop any tables that already exist
    await sequelize.sync({ force: false });
    console.log("Database schema synchronized successfully.");
  } catch (error) {
    console.error("Error synchronizing database schema:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
}

// Call the setupDatabase function to execute the setup process
setupDatabase();
