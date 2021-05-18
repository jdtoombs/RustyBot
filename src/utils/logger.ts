import winston from 'winston';
import { ILogger } from './interfaces';

export default class WinstonLogger implements ILogger {
  readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.printf(log => `[${log.level.toUpperCase()}] = ${log.message}`)
    });
  }

  info(message: string) {
    this.logger.info(message);
  }

  debug(message: string) {
    this.logger.debug(message);
  }

  warn(message: string) {
    this.logger.warn(message);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error(err: any) {
    this.logger.error(err.stack ?? err.message);
  }
}
