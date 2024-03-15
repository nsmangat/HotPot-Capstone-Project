require("dotenv").config();

const express = require("express");
const app = express();
const port = 3000;
const host = process.env.IP_ADDRESS || "localhost";

const cors = require("cors");

app.use(cors());

app.get("/", (req, res) => {
  res.send("YooooooooOOOOooo!");
  console.log("sent??");
});

app.listen(port, () => {
  console.log(host);
  console.log(`Server is running at http://${host}:${port}/`);
});
