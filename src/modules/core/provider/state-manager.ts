import { Injectable, Scope } from '@nestjs/common';
import { configureStore, createReducer } from '@reduxjs/toolkit';
import { createStoreManager } from '../util/store/createStoreManager';

@Injectable({
  scope: Scope.DEFAULT,
})
export class StateManager {
  public static _storeManager = createStoreManager(
    {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      empty: createReducer({}, () => {}),
    },
    [],
    [],
  );
  public static _storeInstance = configureStore({
    reducer: StateManager._storeManager.reduce,
    middleware: [...StateManager._storeManager.middleware()],
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
    return StateManager._storeManager;
  }

  public getStore() {
    return StateManager._storeInstance;
  }
}

export const getStateManager = () => ({
  store: StateManager._storeInstance,
});
