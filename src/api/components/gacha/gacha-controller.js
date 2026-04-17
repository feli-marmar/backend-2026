const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function draw(request, response, next) {
  try {
    const { userId, userName } = request.body;
    if (!userId || !userName) {
      throw errorResponder(
        errorTypes.VALIDATION,
        'diperlukan user_id dan user_name'
      );
    }
    const result = await gachaService.performGacha(userId, userName);
    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

async function getHistory(request, response, next) {
  try {
    const { user_id: userId } = request.params;
    const history = await gachaService.getHistory(userId);
    return response.status(200).json(history);
  } catch (error) {
    return next(error);
  }
}

async function getPrizes(request, response, next) {
  try {
    const prizes = await gachaService.getPrizesWithRemaining();
    return response.status(200).json(prizes);
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    const winners = await gachaService.getWinners();
    return response.status(200).json(winners);
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  draw,
  getHistory,
  getPrizes,
  getWinners,
};
