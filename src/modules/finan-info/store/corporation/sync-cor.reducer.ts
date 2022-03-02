import { createReducer } from '@reduxjs/toolkit';
import {
  corGetNextPageAfterAction,
  finishSyncCor,
  corGetNextPageErrorAction,
} from './sync-cor.actions';
import { SyncCorStateFactory } from './sync-cor.state';

export const syncCorReducer = createReducer(
  SyncCorStateFactory(),
  (builder) => {
    builder
      .addCase(finishSyncCor, (state) => {
        state.running = false;
      })
      .addCase(corGetNextPageAfterAction, (state) => {
        state.running = true;
        state.page = state.page + 1;
      })
      .addCase(corGetNextPageErrorAction, (state) => {
        state.running = false;
      });
  },
);
