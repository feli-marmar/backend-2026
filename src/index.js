const mongoose = require('mongoose');
const { env, port } = require('./core/config');
const logger = require('./core/logger')('app');
const server = require('./core/server');

const Prize = require('./models/prize');

mongoose
  .connect('mongodb://127.0.0.1:27017/gacha-db')
  .then(() => logger.info('Database connected'))
  .catch((err) => logger.error(err, 'DB ERROR'));

async function seedPrize() {
  try {
    if (mongoose.connection.readyState !== 1) {
      logger.info('Menunggu koneksi database...');
      await new Promise((resolve) => {
        mongoose.connection.once('connected', resolve);
      });
    }

    const count = await Prize.countDocuments();
    if (count === 0) {
      const prizes = [
        { name: 'Emas 10 Gram', kuota_hadiah: 1, sisa_kuota_hadiah: 1 },
        { name: 'Smartphone X', kuota_hadiah: 5, sisa_kuota_hadiah: 5 },
        { name: 'Smartwatch Y', kuota_hadiah: 10, sisa_kuota_hadiah: 10 },
        {
          name: 'Voucher Rp 100.000',
          kuota_hadiah: 100,
          sisa_kuota_hadiah: 100,
        },
        { name: 'Pulsa Rp 50.000', kuota_hadiah: 500, sisa_kuota_hadiah: 500 },
      ];
      await Prize.insertMany(prizes);
      logger.info('Hadiah berhasil ditambahkan');
    } else {
      logger.info('Hadiah sudah ada');
    }
  } catch (error) {
    logger.error(error, 'Gagal mendapatkan hadiah');
  }
}

const app = server.listen(port, async (err) => {
  if (err) {
    logger.fatal(err, 'Failed to start the server.');
    process.exit(1);
  } else {
    logger.info(`Server runs at port ${port} in ${env} environment`);
    await seedPrize();
  }
});

process.on('uncaughtException', (err) => {
  logger.fatal(err, 'Uncaught exception.');

  // Shutdown the server gracefully
  app.close(() => process.exit(1));

  // If a graceful shutdown is not achieved after 1 second,
  // shut down the process completely
  setTimeout(() => process.abort(), 1000).unref();
  process.exit(1);
});
