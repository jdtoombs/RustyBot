import Discord from 'discord.js'
import { promises as fsPromises } from 'fs';
import { resolve } from 'path';
import RustyBotClient from '../client';
import { IAsyncInitializer } from '../utils/interfaces';

export interface CommandMessageContext {
  prefix: string;
  commandName: string;
  content: string;
  message: Discord.Message;
  client: RustyBotClient;
}

interface CommandOptions {
  name: string;
  aliases: string[];
  permissions?: Discord.PermissionResolvable[];
  category?: string;
}

export abstract class AbstractCommand {
  public name: string;
  public aliases: string[];
  public permissions: Discord.PermissionResolvable[];
  public abstract run(context: CommandMessageContext): Promise<void>;

  constructor(options: CommandOptions) {
    this.name = options.name;
    this.aliases = options.aliases;
    if (!this.aliases) {
      this.aliases = [this.name.toLowerCase()]
    }
    this.permissions = options.permissions ?? []
  }
}

interface CommandHandlerOptions {
  directory: string;
  prefix?: string;
}

export default class CommandHandler extends Discord.Collection<string, AbstractCommand> implements IAsyncInitializer {
  public readonly commandPrefix: string;

  private readonly _commandDirectory: string;
  private readonly _client: RustyBotClient;

  constructor(client: RustyBotClient, options: CommandHandlerOptions) {
    super();

    const {
      directory,
      prefix = '!'
    } = options;

    this._client = client;
    this._commandDirectory = directory;
    this.commandPrefix = prefix;

    this.init().catch((err) => {
      this._client.logger.error(err);
    })
  }

  async init () {
    await this.load(this._commandDirectory);
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
        const commandClass = require(commandPath).default;
        const command = new commandClass() as AbstractCommand;
        for(const alias of command.aliases) {
          if (this.has(alias)) {
            this._client.logger.warn(`Command for ${alias} already exists in cache.`);
          } else {
            this.set(alias, command);
            this._client.logger.info(`Registered ${alias} command.`)
          }
        }
      }
    }
  }

  async handleCommand(message: Discord.Message): Promise<void> {
    try {
      if (!message.content.startsWith(this.commandPrefix)) {
        return;
      }

      const wordSplits = message.content.split(' ');
      const commandWord = wordSplits[0].slice(1);
      const command = this.get(commandWord);
      if (!command) return;
      await command.run({
        client: this._client,
        commandName: command.name,
        content: wordSplits.slice(1).join(' '),
        message: message,
        prefix: this.commandPrefix
      });
    } catch (err) {
      this._client.logger.error(err);
    }
  }
}
