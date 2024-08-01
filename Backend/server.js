require("dotenv").config();
const User = require("./models/user");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const verifyToken = require("./firebase/authMiddleware");

const app = express();
const port = 3000;
// const host = process.env.IP_ADDRESS || "localhost";

app.use(cors());
app.use(express.json());
app.use("/protected", verifyToken);

//Import routes
const historyRoute = require("./routes/history");
const manualReportRoute = require("./routes/Report");
const mapRoute = require("./routes/Map");
const leaderboardRoute = require("./routes/Leaderboard");

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(express.json());
app.use("/protected", verifyToken);

app.get("/protected/users", async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

//User routes
app.use("/protected/history", historyRoute);
app.use("/protected/report", manualReportRoute);
app.use("/protected/map", mapRoute);
app.use("/protected/leaderboard", leaderboardRoute);

const server = app.listen(port, () => {
  console.log(`Server is running at http://${process.env.IP_ADDRESS}:${port}/`);
});

module.exports = server;
