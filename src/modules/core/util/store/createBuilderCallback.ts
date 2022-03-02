import { ActionReducerMapBuilder } from '@reduxjs/toolkit';

export function createBuilderCallback<S>(
  builderFn: (builder: ActionReducerMapBuilder<S>) => void,
) {
  return (builder: ActionReducerMapBuilder<S>) => builderFn(builder);
}
