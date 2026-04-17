const Prize = require('../../../models/prize');
const GachaRecord = require('../../../models/GachaRecord');
const DailyLimit = require('../../../models/DailyLimit');

async function getAllPrizes() {
  return Prize.find({});
}

async function getAvailablePrizes() {
  return Prize.find({ sisa_kuota_hadiah: { $gt: 0 } });
}

async function decrementPrizeQuota(prizeId) {
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

async function getWinnersByPrize(prizeId = null) {
  const filter = { isWin: true };
  if (prizeId) filter.prizeId = prizeId;
  return GachaRecord.find(filter).sort({ timestamp: 1 });
}

module.exports = {
  getAllPrizes,
  getAvailablePrizes,
  decrementPrizeQuota,
  createGachaRecord,
  getGachaHistory,
  getDailyLimit,
  incrementDailyLimit,
  getWinnersByPrize,
};
