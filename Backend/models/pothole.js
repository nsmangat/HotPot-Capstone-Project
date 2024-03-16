const mongoose = require('mongoose')

const potholeSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  }
})

const Pothole = mongoose.model('Pothole', potholeSchema);
module.exports = Pothole;
