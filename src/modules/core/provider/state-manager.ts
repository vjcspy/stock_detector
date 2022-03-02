import { Injectable, Scope } from '@nestjs/common';
import { configureStore, createReducer } from '@reduxjs/toolkit';
import { createStoreManager } from '../util/store/createStoreManager';
import logger from 'redux-logger';

@Injectable({
  scope: Scope.DEFAULT,
})
export class StateManager {
  protected _storeManager = createStoreManager(
    {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      empty: createReducer({}, () => {}),
    },
    [],
    [logger],
  );
  protected _storeInstance = configureStore({
    reducer: this._storeManager.reduce,
    middleware: [...this._storeManager.middleware()],
    devTools:
      process?.env?.NODE_ENV == 'production' ||
      process?.env?.NEXT_PUBLIC_NODE_ENV == 'production'
        ? false
        : {
            maxAge: 50,
            trace: true,
            traceLimit: 10,
          },
  });

  constructor() {
    this.getStoreManager().runEpic();
  }

  public getStoreManager() {
    return this._storeManager;
  }

  public getStore() {
    return this._storeInstance;
  }
}
