import * as dotenv from 'dotenv';
import { resolve } from 'path'
import RustyBotClient from './client';

dotenv.config();

const bot = new RustyBotClient();
// bot.loadCommands(resolve(__dirname, "commands"))
bot.login(process.env.TOKEN)
  .catch((err) => {
    console.log(err);
    process.exit(1);
  })
