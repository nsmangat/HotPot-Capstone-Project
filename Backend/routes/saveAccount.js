const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bodyParser = require("body-parser");
const admin = require("../firebase/firebase");
const { pool } = require("../server");

router.use(bodyParser.json());

router.post("/", async (req, res) => {
  console.log("save acc to db");
  const firebase_uid = req.user.uid;
  const email = req.body.email;
  const phoneNumber = req.body.phoneNum;
  const firstName = req.body.username;

  console.log(firstName);
  try {
    const newUser = await User.create({
      firebase_uid: firebase_uid,
      email: email,
      password: "password",
      phone_number: phoneNumber,
      first_name: firstName,
      last_name: "lastName",
    });

    res.status(201).send(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = router;
