const express = require('express');
const router = express.Router();
const Report = require("../models/report");
const { where } = require('sequelize');
const CURRENT_USER = "a"

router.get('/', async(req, res) =>{
    try{
        const history = await Report.findAll(where={user_id:CURRENT_USER})
        //TODO: get pothole details from pothole table
        console.log(history);
      res.json(history);
    }catch{
        console.error("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
});
  

module.exports = router;