import { Client } from "discord.js";
import Logger from "./utils/logger";

export default class RustyBotClient extends Client {
  public logger: Logger;

  constructor() {
    super();

    this.logger = new Logger();
  }

  async loadCommands(commandsDirectory: string) {
    this.logger.info("Loading commands in " + commandsDirectory);
  }

  public async login(token?: string): Promise<string> {
    this.logger.info("logging in");
    return super.login(token);
  }
}
