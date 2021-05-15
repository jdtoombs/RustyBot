import Discord from 'discord.js'
import { promises as fsPromises } from 'fs';
import { resolve } from 'path';
import RustyBotClient from '../client';
import { IAsyncInitializer } from '../utils/interfaces';

export interface CommandMessageContext {
  message: Discord.Message;
  client: RustyBotClient;
  content: string;
}

export interface ICommand {
  name: string;
  aliases: string[];
  permissions: Discord.PermissionResolvable[];
  category?: string;
  run(context: CommandMessageContext): Promise<void>;
}

export default class CommandHandler extends Discord.Collection<string, ICommand> implements IAsyncInitializer {
  public commandsDirectory: string;
  public client: RustyBotClient;

  constructor(client: RustyBotClient, commandsDirectory: string) {
    super();
    this.client = client;
    this.commandsDirectory = commandsDirectory;
    this.init().catch((err) => {
      this.client.logger.error(err);
    })
  }

  async init () {
    await this.load(this.commandsDirectory);
  }

  async load (dir: string, category: string = "") {
    const { readdir, stat } = fsPromises;
    const files = await readdir(dir);
    for(const file of files) {
      const commandPath = resolve(dir, file);
      const stats = await stat(commandPath);
      // the command directory should only have one sub-directory (for now)
      if (stats.isDirectory() && !category) {
        await this.load(commandPath, file);
      } else if (stats.isFile() && (file.endsWith(".js") || file.endsWith(".ts"))) {
        // console.log(category || "none", file);
      }
    }
  }
}
