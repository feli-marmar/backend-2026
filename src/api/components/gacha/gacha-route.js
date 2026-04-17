const express = require('express');

const route = express.Router();
const gachaController = require('./gacha-controller');

module.exports = (app) => {
  app.use('/gacha', route);

  route.post('/', gachaController.draw);

  route.get('/history/:user_id', gachaController.getHistory);

  route.get('/prizes', gachaController.getPrizes);

  route.get('/winners', gachaController.getWinners);
};
