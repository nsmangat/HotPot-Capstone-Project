const express = require("express");
const router = express.Router();
const sequelize = require("../sequalize");

router.get("/", async (req, res) => {
  try {
    //Firebase uid
    const currentUserUid = req.user.uid;

    //Get fixed pothole count for each user who has a fixed pothole reported
    const query = `
      SELECT u.first_name, u.firebase_uid, COUNT(p.pothole_id) AS fixed_potholes_count
      FROM users u
      JOIN reports r ON u.firebase_uid = r.firebase_uid
      JOIN potholes p ON r.pothole_id = p.pothole_id
      WHERE p.is_fixed = true
      GROUP BY u.first_name, u.firebase_uid
      HAVING COUNT(p.pothole_id) > 0
      ORDER BY fixed_potholes_count DESC;
    `;

    const usersWithFixedPotholes = await sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
    });

    //Map each user and count to array of objects in JSON ie [ {first_name, fixed_potholes_count, is_current_user}, ...]
    const response = usersWithFixedPotholes.map((user) => ({
      first_name: user.first_name,
      fixed_potholes_count: user.fixed_potholes_count,
      is_current_user: user.firebase_uid === currentUserUid,
    }));

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
