export interface IAsyncInitializer {
  init: () => Promise<unknown>;
}

export interface ILogger {
  info: (message: string) => void;
  debug: (message: string) => void;
  warn: (message: string) => void;
  error: (err: unknown) => void;
}
