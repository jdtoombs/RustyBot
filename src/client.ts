import { Client } from "discord.js";

export default class RustyBotClient extends Client {
  constructor() {
    super();
  }

  public async login(token?: string): Promise<string> {
    return super.login(token);
  }
}
