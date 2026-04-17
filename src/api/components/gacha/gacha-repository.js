const Prize = require('../../../models/prize');
const GachaRecord = require('../../../models/GachaRecord');
const DailyLimit = require('../../../models/DailyLimit');

async function getAllprizes() {
  return Prize.find({});
}

async function getAvailableprize() {
  return Prize.find({ sisa_kuota_hadiah: { $gt: 0 } });
}

async function decrementprizeQuota(prizeId) {
  return Prize.updateOne(
    { _id: prizeId, sisa_kuota_hadiah: { $gt: 0 } },
    { $inc: { sisa_kuota_hadiah: -1 } }
  );
}

async function createGachaRecord(record) {
  return GachaRecord.create(record);
}

async function getGachaHistory(userId) {
  return GachaRecord.find({ userId }).sort({ timestamp: -1 });
}

async function getDailyLimit(userId, date) {
  return DailyLimit.findOne({ userId, date });
}

async function incrementDailyLimit(userId, date) {
  return DailyLimit.updateOne(
    { userId, date },
    { $inc: { count: 1 } },
    { upsert: true }
  );
}

async function getWinnersByprize(prizeId = null) {
  const filter = { isWin: true };
  if (prizeId) filter.prizeId = prizeId;
  return GachaRecord.find(filter).sort({ timestamp: 1 });
}

module.exports = {
  getAllprizes,
  getAvailableprize,
  decrementprizeQuota,
  createGachaRecord,
  getGachaHistory,
  getDailyLimit,
  incrementDailyLimit,
  getWinnersByprize,
};
