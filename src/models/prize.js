// const mongoose = require('mongoose');

import mongoose from 'mongoose';

const prizeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  kuota_hadiah: { type: Number, required: true },
  sisa_kuota_hadiah: { type: Number, required: true },
});

const Prize = mongoose.models.Prize || mongoose.model('Prize', prizeSchema);

export default Prize;
