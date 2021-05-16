import Discord, { ClientEvents } from 'discord.js';
import { promises as fsPromises } from 'fs';
import { resolve } from 'path';
import RustyBotClient from '../client';
import { IAsyncInitializer } from '../utils/interfaces';

interface EventOptions {
  name: keyof ClientEvents;
  once?: boolean;
}

export abstract class AbstractEvent {
  public name: string;
  public once: boolean;

  constructor(options: EventOptions) {
    this.name = options.name;
    this.once = options.once ?? false;
  }

  abstract run(client: RustyBotClient, ...args: unknown[]): Promise<void>;
}

interface EventHandlerOptions {
  directory: string;
}

export default class EventHandler extends Discord.Collection<string, AbstractEvent> implements IAsyncInitializer {
  private readonly _eventsDirectory: string;
  private readonly _client: RustyBotClient;

  constructor(client: RustyBotClient, options: EventHandlerOptions) {
    super();
    this._client = client;

    const {
      directory
    } = options;

    this._eventsDirectory = directory;

    this.init().catch((err) => {
      this._client.logger.error(err);
    });
  }

  async init() {
    await this.load(this._eventsDirectory);
  }

  async load(fileDirectory: string) {
    const { readdir, stat } = fsPromises;
    const files = await readdir(fileDirectory);
    for (const file of files) {
      const eventPath = resolve(fileDirectory, file);
      const stats = await stat(eventPath);
      if (stats.isFile() && (file.endsWith(".js") || file.endsWith(".ts"))) {
        // eslint-disable-next-line security/detect-non-literal-require
        const evtClass = require(eventPath).default;
        const evt = new evtClass() as AbstractEvent;

        if (this.has(evt.name)) {
          this._client.logger.warn(`The ${evt.name} event already exists in cache.`);
        } else {
          this._client[evt.once ? 'once' : 'on'](evt.name, (...args) => evt.run(this._client, ...args));
          this._client.logger.info(`Registered ${evt.name} event.`);
        }
      }
    }
  }
}
