const gachaService = require('./gacha-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

async function draw(request, response, next) {
  try {
    const { userId, userName } = request.body;
    if (!userId || !userName) {
      throw errorResponder(
        errorTypes.VALIDATION_ERROR,
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
    // Implement history retrieval logic here
    return response.status(200).json({ message: `History for user ${userId}` });
  } catch (error) {
    return next(error);
  }
}

async function getprizes(request, response, next) {
  try {
    // Implement prizes retrieval logic here
    return response.status(200).json({ message: 'List of prizes' });
  } catch (error) {
    return next(error);
  }
}

async function getWinners(request, response, next) {
  try {
    // Implement winners retrieval logic here
    return response.status(200).json({ message: 'List of winners' });
  } catch (error) {
    return next(error);
  }
}
module.exports = {
  draw,
  getHistory,
  getprizes,
  getWinners,
};
