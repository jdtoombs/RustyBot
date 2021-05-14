import Discord from 'discord.js';
import * as dotenv from 'dotenv';

const client = new Discord.Client();

dotenv.config();

client.on('ready', () => {
  console.log(`Logged in as ${client.user!.tag}!`);
});

client.on('message', (msg) => {
  if (msg.content === '!test') {
    msg.reply('testing');
  }
});

client.login(process.env.TOKEN);
