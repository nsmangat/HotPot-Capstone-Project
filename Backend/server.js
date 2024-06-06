require("dotenv").config();
const User = require("./models/user");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const verifyToken = require('./firebase/authMiddleware');

const app = express();
const port = 3000;
// const host = process.env.IP_ADDRESS || "localhost";

app.use(cors());

//Import routes
const historyRoute = require('./routes/history');

// Create a PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

app.use(verifyToken);

// Get all users from DB
app.get("/users", async (req, res) => {
  try {
    const users = await User.findAll();
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

//User routes
app.use('/history',historyRoute);

app.listen(port, () => {
  console.log(`Server is running at http://${process.env.IP_ADDRESS}:${port}/`);
});
