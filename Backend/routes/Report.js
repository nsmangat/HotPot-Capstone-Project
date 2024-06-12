const express = require("express");
const router = express.Router();
const Pothole = require("../models/pothole");
const Report = require("../models/report");

router.post("/", async (req, res) => {
  //TODO: logic to increment report count when pothole coordinates are close to an existing report

  //else

  //first save to potholes table
  try {
    const newPothole = await Pothole.create({
      pothole_size: req.body.description,
      description: req.body.details,
      coordinates: req.body.coordinates,
      address: "placeholder",
      number_of_reports: 1,
      is_fixed: false,
      first_reported_date: new Date(),
      updated_at: new Date(),
      is_reported: false,
    });

    //if pothole was created successfully, create the report history for it
    if (newPothole) {
      try {
        const newReport = await Report.create({
          pothole_id: newPothole.pothole_id,
          firebase_uid: firebase_uid,
          report_date: newPothole.first_reported_date,
        });
        res.status(201).json([newPothole, newReport]);
      } catch (err) {
        console.log(err);
        res.status(500).send("Error reporting pothole");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send("Error reporting pothole");
  }
});

module.exports = router;
