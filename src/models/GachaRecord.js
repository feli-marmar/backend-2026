const mongoose = require('mongoose');

const gachaRecordSchema = new mongoose.Schema({
  userId: { type: String },
  userName: { type: String },
  isWin: { type: Boolean },
  prizeId: { type: mongoose.Schema.Types.ObjectId },
  prizeName: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports =
  mongoose.model.GachaRecord ||
  mongoose.model('GachaRecord', gachaRecordSchema);
