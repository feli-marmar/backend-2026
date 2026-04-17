const gachaRepository = require('./gacha-repository');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function checkDailyLimit(userId, date) {
  const maxLimit = 5;
  const dailylimit = await gachaRepository.getDailyLimit(userId, date);
  const currentCount = dailylimit ? dailylimit.count : 0;
  if (currentCount >= maxLimit) {
    throw errorResponder(
      errorTypes.RATE_LIMIT_EXCEEDED,
      'Daily limit sudah tercapai'
    );
  }
}

async function performGacha(userId, userName) {
  const today = new Date().toISOString().slice(0, 10);
  await checkDailyLimit(userId, today);

  const Availableprizes = await gachaRepository.getAvailablePrizes();
  let isWinner = false;
  let selectedPrize = null;

  if (Availableprizes.length > 0 && Math.random() < 0.3) {
    const randomIndex = Math.floor(Math.random() * Availableprizes.length);
    const prize = Availableprizes[randomIndex];
    const result = await gachaRepository.decrementPrizeQuota(prize.id);
    if (result.modifiedCount > 0) {
      isWinner = true;
      selectedPrize = prize;
    } else {
      isWinner = false;
      selectedPrize = null;
    }
  }
  await gachaRepository.incrementDailyLimit(userId, today);

  const record = {
    userId,
    userName,
    timestamp: new Date(),
    isWin: isWinner,
    prizeId: isWinner ? selectedPrize.id : null,
    prizeName: isWinner ? selectedPrize.name : null,
  };
  await gachaRepository.createGachaRecord(record);

  if (isWinner) {
    return {
      message: `Selamat kamu mendapatkan hadiah yaitu ${selectedPrize.name}`,
      prize: selectedPrize.name,
    };
  }
  return {
    message:
      'Maaf, kamu tidak mendapatkan hadiah. Silahkan coba lagi lain waktu yaa!',
  };
}

async function getHistory(userId) {
  return gachaRepository.getGachaHistory(userId);
}

async function getPrizesWithRemaining() {
  const prizes = await gachaRepository.getAllPrizes();
  return prizes.map((p) => ({
    id: p.id,
    name: p.name,
    kuota_hadiah: p.kuota_hadiah,
    sisa_kuota_hadiah: p.sisa_kuota_hadiah,
  }));
}

async function getWinners(prizeId = null) {
  const winners = await gachaRepository.getWinnersByPrize(prizeId);
  const anonymize = (name) =>
    name
      .split(' ')
      .map((word) => {
        if (word.length <= 2) return word;
        return word[0] + '*'.repeat(word.length - 2) + word[word.length - 1];
      })
      .join(' ');
  return winners.map((w) => ({
    prizeName: w.prizeName,
    anonymizeName: anonymize(w.userName),
    winDate: w.timestamp,
  }));
}

module.exports = {
  performGacha,
  getHistory,
  getPrizesWithRemaining,
  getWinners,
};
