import { createReducer } from '@reduxjs/toolkit';

import { corGetNextPageAfterAction } from './sync-cor.actions';
import { SyncCorStateFactory } from './sync-cor.state';

export const syncCorReducer = createReducer(
  SyncCorStateFactory(),
  (builder) => {
    builder.addCase(corGetNextPageAfterAction, (state) => {
      state.page = state.page + 1;
    });
  },
);
