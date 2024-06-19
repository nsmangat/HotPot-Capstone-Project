const express = require("express");
const router = express.Router();
const Pothole = require("../models/pothole");


async function getAllPotholes(firebaseUID) {
    try {
        const potholes = await Pothole.findAll();

        return potholes.map((pothole) => {
            const coordinates = pothole.dataValues.coordinates.split(','); // Split the string by comma
            return {
                Pothole_ID: pothole.dataValues.pothole_id,
                Size: pothole.dataValues.pothole_size,
                Latitude: parseFloat(coordinates[0]), // Parse the first element as latitude
                Longitude: parseFloat(coordinates[1]), // Parse the second element as longitude
                Address: pothole.dataValues.address,
                NumberOfReports: pothole.dataValues.number_of_reports,
                FirstReported: pothole.dataValues.first_reported_date,
            };
        });

    } catch (err) {
        console.error("Error fetching all potholes:", err);
    }
}



router.get("/", async (req, res) => {
    try {
        const potholes = await getAllPotholes(req.user.uid);
        res.json(potholes);
    } catch (err) {
        console.error("Error fetching potholes:", err);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
