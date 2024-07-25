const { get } = require("mongoose");
const Pothole = require("../models/pothole");


async function getAllPotholes(firebaseUID) {
    try {
        const potholes = await Pothole.findAll({
            where: {
              is_fixed: false
            }
          });

        return potholes.map((pothole) => {
            const coordinates = pothole.dataValues.coordinates.split(','); // Split the string by comma
            return {
                Pothole_ID: pothole.dataValues.pothole_id,
                Size: pothole.dataValues.pothole_size,
                latitude: parseFloat(coordinates[0]), // Parse the first element as latitude
                longitude: parseFloat(coordinates[1]), // Parse the second element as longitude
                Address: pothole.dataValues.address,
                NumberOfReports: pothole.dataValues.number_of_reports,
                FirstReported: pothole.dataValues.first_reported_date,
                EstimatedFixDate: pothole.dataValues.estimated_fix_date,
            };
        });

    } catch (err) {
        console.error("Error fetching all potholes:", err);
    }
}

module.exports = getAllPotholes;