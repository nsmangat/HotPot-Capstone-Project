const express = require("express");
const router = express.Router();
const Pothole = require("../models/pothole");
const Report = require("../models/report");
const { Op } = require("sequelize"); // Import Sequelize operators

router.post("/", async (req, res) => {
  firebase_uid = req.user.uid;

  //Extracting the main address i.e. street number, street, city since some entries have more info but just comparing on this part
  const extractMainAddress = (address) => {
    const addressParts = address.split(",");
    const mainAddress = addressParts.slice(0, 2).join(",").trim().toLowerCase();
    return mainAddress;
  };

  const mainAddress = extractMainAddress(req.body.address);

  try {
    //First check if the reported pothole has already been reported by checking if they have the same address
    //Can add coordinates check later
    const existingPothole = await Pothole.findOne({
      where: {
        address: { [Op.iLike]: `%${mainAddress}%` }, //Case insensitive so doesn't matter if address is capitalized or not in the db
      },
    });

    if (existingPothole) {
      // If a pothole exists, increment the report count and update the timestamp
      existingPothole.number_of_reports += 1;
      existingPothole.updated_at = new Date();

      await existingPothole.save();

      // Create a new report history entry for the existing pothole
      try {
        const newReport = await Report.create({
          pothole_id: existingPothole.pothole_id,
          firebase_uid: firebase_uid,
          report_date: new Date(),
        });
        return res.status(200).json([existingPothole, newReport]);
      } catch (err) {
        console.log(err);
        return res.status(500).send("Error reporting pothole");
      }
    } else {
      //Pothole doesn't exist so create a new one
      const newPothole = await Pothole.create({
        pothole_size: req.body.description,
        description: req.body.details,
        coordinates: req.body.coordinates,
        address: req.body.address,
        number_of_reports: 1,
        is_fixed: false,
        first_reported_date: new Date(),
        updated_at: new Date(),
        is_reported: false,
      });

      // If pothole was created successfully, create the report history for it
      if (newPothole) {
        try {
          const newReport = await Report.create({
            pothole_id: newPothole.pothole_id,
            firebase_uid: firebase_uid,
            report_date: newPothole.first_reported_date,
          });
          return res.status(201).json([newPothole, newReport]);
        } catch (err) {
          console.log(err);
          return res.status(500).send("Error reporting pothole");
        }
      }
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Error reporting pothole");
  }

  // try {
  //   const newPothole = await Pothole.create({
  //     pothole_size: req.body.description,
  //     description: req.body.details,
  //     coordinates: req.body.coordinates,
  //     address: req.body.address,
  //     number_of_reports: 1,
  //     is_fixed: false,
  //     first_reported_date: new Date(),
  //     updated_at: new Date(),
  //     is_reported: false,
  //   });

  //   //if pothole was created successfully, create the report history for it
  //   if (newPothole) {
  //     try {
  //       const newReport = await Report.create({
  //         pothole_id: newPothole.pothole_id,
  //         firebase_uid: firebase_uid,
  //         report_date: newPothole.first_reported_date,
  //       });
  //       res.status(201).json([newPothole, newReport]);
  //     } catch (err) {
  //       console.log(err);
  //       res.status(500).send("Error reporting pothole");
  //     }
  //   }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).send("Error reporting pothole");
  // }
});

module.exports = router;
