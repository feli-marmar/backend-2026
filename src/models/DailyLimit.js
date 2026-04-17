const mongoose = require('mongoose');

const dailyLimitSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
});

dailyLimitSchema.index({ userId: 1, date: 1 }, { uniqe: true });

module.exports =
  mongoose.Model.DailyLimit || mongoose.model('DailyLimit', dailyLimitSchema);
