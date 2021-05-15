import { Client } from "discord.js";
import { resolve } from "path";
import CommandHandler from "./handlers/CommandHandler";
import { IAsyncInitializer } from "./utils/interfaces";
import Logger from "./utils/logger";

export default class RustyBotClient extends Client implements IAsyncInitializer {
  public logger: Logger;
  public commandHandler: CommandHandler;

  constructor() {
    super();

    this.logger = new Logger();
    this.commandHandler = new CommandHandler(this, resolve(__dirname, "commands"));

    this.init().catch((err) => {
      this.logger.error(err);
    })
  }

  public async init () {
    await this.login(process.env.TOKEN);
  }

  async login(token?: string): Promise<string> {
    this.logger.info("logging in");
    return super.login(token);
  }
}
