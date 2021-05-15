export interface IAsyncInitializer {
  init: () => Promise<unknown>;
}
