const { Telegraf } = require('telegraf');


const BOT_TOKEN = '6534368323:AAH8AP0IiXYTR_2pH7sxIYlvSmszAKoL-pQ';
const myUserId = '1495044552';

const bot = new Telegraf(BOT_TOKEN);
bot.start((ctx) => {
  // Get the user ID
  const userId = ctx.from.id;

  // Send a message using the obtained user ID
  ctx.telegram.sendMessage(
    userId,
    'Hello! This is a message sent in response to your text.',
  );

  // You can also log the user ID
  console.log(`User ID: ${userId}`);
});
bot.telegram.sendMessage(myUserId, `Start`);
bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

const alertNewVacancy = (vacancyURL) => {
  bot.telegram.sendMessage(
    myUserId,
    `Hello! New vacancy appeared: ${vacancyURL}`,
  );
};
module.exports = {
  alertNewVacancy,
};
