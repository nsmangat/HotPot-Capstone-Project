const { Report, Pothole } = require("../models/associations");

async function getUserReportHistory(firebaseUID) {
  try {
    const reports = await Report.findAll({
      where: { firebase_uid: firebaseUID },
      include: [
        {
          model: Pothole,
          as: "Pothole",
          attributes: ["description", "is_fixed", "address", "pothole_size"],
        },
      ],
      order: [["time_reported", "DESC"]],
    });

    return reports.map((report) => ({
      description: report.Pothole.description,
      dateTime: report.time_reported,
      is_fixed: report.Pothole.is_fixed,
      address: report.Pothole.address,
      size: report.Pothole.pothole_size,
    }));
  } catch (err) {
    console.error("Error fetching user report history:", err);
  }
}

async function deleteHistory(firebaseUID, time_reported){
  try{
    const result = await Report.destroy({
      where:
      {
        time_reported:time_reported,
        firebase_uid: firebaseUID,
      },
    });
    return result;
  }catch(err){
    console.log("Error deleting history:", err);
  }
}

module.exports = { getUserReportHistory, deleteHistory };
