import Discord, { ClientEvents } from 'discord.js';
import glob from 'glob';
import { resolve } from 'path';
import RustyBotClient from '../client';
import { IAsyncInitializer } from '../utils/interfaces';

interface EventOptions {
  name: keyof ClientEvents;
  once?: boolean;
}

export abstract class AbstractEvent {
  public name: keyof ClientEvents;
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
    this.load(this._eventsDirectory);
  }

  load(fileDirectory: string) {
    const files = glob.sync(resolve(fileDirectory, '+(*.js|*.ts)'));
    for (const file of files) {
      const eventPath = resolve(fileDirectory, file);
      if (file.endsWith(".js") || file.endsWith(".ts")) {
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
