import Discord from 'discord.js';
import RustyBotClient from '../client';
import { AbstractEvent } from '../handlers/EventHandler';

export default class MessageEvent extends AbstractEvent {
  constructor() {
    super({
      name: 'message'
    })
  }

  async run(client: RustyBotClient, message: Discord.Message) {
    if (message.author.bot) return;

    client.commandHandler.handleCommand(message);
  }
}
