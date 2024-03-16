require("dotenv").config();

const express = require("express");
const mongoose = require('mongoose');
const cors = require("cors");
const Pothole = require("./models/pothole");

const app = express();
const port = 3000;
const host = process.env.IP_ADDRESS || "localhost";

app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.get("/", async (req, res) => {
  try {
    console.log("Responding to request");
    const potholeData = await Pothole.find();
    res.json(potholeData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.listen(port, () => {
  console.log(host);
  console.log(`Server is running at http://${host}:${port}/`);
});
