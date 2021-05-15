import winston from 'winston'

interface ILogger {
  info: (message: string) => void;
  debug: (message: string) => void;
  warn: (message: string) => void;
  error: (err: any) => void;
}

export default class Logger implements ILogger {
  readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console()
      ],
      format: winston.format.printf(log => `[${log.level.toUpperCase()}] = ${log.message}`)
    })
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

  error(err: any) {
    this.logger.error(err.stack ?? err.message);
  }
}
