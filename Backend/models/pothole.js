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
    description: {
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
    coordinates: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    is_fixed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
    },
    is_reported: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      unique: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    estimated_fix_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // Disable timestamps, since by default it adds "createdAt" and "updatedAt" fields
    timestamps: false,
    // Had to add table name else it wasn't working
    tableName: "potholes",
  }
);

module.exports = Pothole;
