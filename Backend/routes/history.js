const express = require('express');
const router = express.Router();
const {pool} = require("../server")
const { Report, Pothole } = require('../models/associations');

async function getUserReportHistory(firebaseUID) {
    try {
      const reports = await Report.findAll({
        where: { firebase_uid: firebaseUID },
        include: [{
          model: Pothole,
          as: 'Pothole',
          attributes: ['description', 'is_fixed', 'address', 'pothole_size']
        }],
        order: [['time_reported', 'DESC']]
      });
      
      return reports.map(report => ({
        description: report.Pothole.description,
        dateTime: report.time_reported,
        is_fixed: report.Pothole.is_fixed,
        address: report.Pothole.address,
        size: report.Pothole.pothole_size
      }));
    } catch (err) {
      console.error('Error fetching user report history:', err);
      throw err;
    }
  }
  
router.get('/report-history', async(req, res) =>{
    try{
        const history = await getUserReportHistory(req.user.uid)
        console.log(history);
      res.json(history);
    }catch{
        console.error("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
});
  

module.exports = router;