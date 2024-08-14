const express = require("express");
const router = express.Router();
const { pool } = require("../server");
const { getUserReportHistory, deleteHistory } = require("./historyService");

router.get("/", async (req, res) => {
  try {
    const history = await getUserReportHistory(req.user.uid);
    res.json(history);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("Internal Server Error");
  }
});

router.delete("/:reported_time", async (req, res) => {
  try {
    const result = await deleteHistory(req.user.uid, req.params.reported_time);
    if (result) {
      res.status(200).json({ message: "Deleted history successfully!" });
    } else {
      res.status(400).json({ message: "History not found." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
