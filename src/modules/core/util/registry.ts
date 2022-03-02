import { Map } from 'immutable';

export class Registry {
  private static _instance: Registry = new Registry();
  private _cachedData = Map<string, any>();

  public static getInstance(): Registry {
    return Registry._instance;
  }

  register(key: string, value: any): Registry {
    this._cachedData = this._cachedData.set(key, value);

    return this;
  }

  registry(key: string) {
    return this._cachedData.get(key);
  }

  unregister(key: string): Registry {
    this._cachedData.delete(key);

    return this;
  }
}
