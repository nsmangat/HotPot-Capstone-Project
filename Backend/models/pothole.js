const { DataTypes } = require("sequelize");
const sequelize = require("../sequalize");

const Pothole = sequelize.define(
  "Pothole",
  {
    pothole_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pothole_size: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    first_reported_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    number_of_reports: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    is_fixed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Disable timestamps, since by default it adds "createdAt" and "updatedAt" fields
    timestamps: false,
    // Had to add table name else it wasn't working
    tableName: "potholes",
  }
);

// Create the table if it doesn't exist
// (async () => {
//   try {
//     await Pothole.sync({ force: false }); // Set force to true to drop existing table and recreate it
//     console.log("Potholes table synced successfully.");
//   } catch (error) {
//     console.error("Error syncing potholes table:", error);
//   } finally {
//     // Close the database connection
//     await sequelize.close();
//   }
// })();

module.exports = Pothole;
