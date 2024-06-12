const { DataTypes } = require("sequelize");
const sequelize = require("../sequalize");

const Pothole = require("./pothole");
const User = require("./user");

// report_id PK, pothole_id and user_id FKs
const Report = sequelize.define(
  "Report",
  {
    report_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    pothole_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Pothole,
        key: "pothole_id",
      },
    },
    firebase_uid: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: User,
        key: "firebase_uid",
      },
    },
    time_reported: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "reports",
    timestamps: false,
  }
);

module.exports = Report;