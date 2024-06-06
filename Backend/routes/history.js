const express = require('express');
const router = express.Router();
const Pothole = require("../models/pothole");
const { where } = require('sequelize');

router.get('/', async(req, res) =>{
    try{
        const history = await Pothole.findAll()
        //TODO: get pothole details from pothole table
        console.log(history);
      res.json(history);
    }catch{
        console.error("Error fetching users:", err);
        res.status(500).send("Internal Server Error");
    }
});
  

module.exports = router;