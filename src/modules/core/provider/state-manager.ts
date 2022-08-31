import { Injectable, Scope } from '@nestjs/common';
import { configureStore, createReducer } from '@reduxjs/toolkit';
import { createStoreManager } from '../util/store/createStoreManager';
import { List } from 'immutable';
import { EFFECT_PROPERTY_KEY } from '@module/core/decorator/store-effect';

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
    devTools: false,
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

  addFeatureEffect(featureName: string, ...effectObjects: any[]) {
    const _effects = [];
    effectObjects.forEach((effectObject) => {
      const propertyEffectMetadata: List<string> = Reflect.getMetadata(
        EFFECT_PROPERTY_KEY,
        effectObject,
      );
      if (propertyEffectMetadata) {
        propertyEffectMetadata.forEach((_effectProperty) => {
          if (typeof effectObject[_effectProperty] === 'function') {
            _effects.push(effectObject[_effectProperty]);
          }
        });
      }
    });

    this.getStoreManager().addEpics(featureName, _effects);
  }
}

export const getStateManager = () => ({
  store: StateManager._storeInstance,
});
