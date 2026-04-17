const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kuota_hadiah: { type: Number, required: true },
  sisa_kuota_hadiah: { type: Number, required: true },
});

module.exports = mongoose.models.Prize || mongoose.model('Prize', prizeSchema);
