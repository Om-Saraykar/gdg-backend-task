const mongoose = require('mongoose');

const movieSchemaV2 = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: String, required: true },
  rating: { type: Number, required: true },
  releaseDate: { type: Date, required: true },
  runtime: { type: Number, required: true },
  director: { type: String, required: true } 
});

module.exports = mongoose.model('MovieV2', movieSchemaV2);
