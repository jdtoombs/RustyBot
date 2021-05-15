import { Client } from "discord.js";
import CommandHandler from "./handlers/CommandHandler";

export default class RustyBotClient extends Client {
  public commandHandler: CommandHandler;

  constructor() {
    super();

    this.commandHandler = new CommandHandler();
  }

  async loadCommands(commandsDirectory: string) {
    await this.commandHandler.load(commandsDirectory);
  }

  public async login(token?: string): Promise<string> {
    return super.login(token);
  }
}
