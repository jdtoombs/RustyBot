import { Client } from "discord.js";
import { resolve } from "path";
import CommandHandler from "./handlers/CommandHandler";
import EventHandler from "./handlers/EventHandler";
import { IAsyncInitializer, ILogger } from "./utils/interfaces";
import WinstonLogger from "./utils/logger";

export default class RustyBotClient extends Client implements IAsyncInitializer {
  public logger: ILogger;
  public commandHandler: CommandHandler;
  public eventHandler: EventHandler;

  constructor() {
    super();

    this.logger = new WinstonLogger();

    this.commandHandler = new CommandHandler(this, {
      directory: resolve(__dirname, "commands"),
      prefix: process.env.PREFIX
    });

    this.eventHandler = new EventHandler(this, {
      directory: resolve(__dirname, "events")
    });

    this.init().catch((err) => {
      this.logger.error(err);
    });
  }

  public async init() {
    await this.login(process.env.TOKEN);
  }

  async login(token?: string): Promise<string> {
    this.logger.info("logging in");
    return super.login(token);
  }
}
