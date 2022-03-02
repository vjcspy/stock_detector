import {
  ActionCreatorWithOptionalPayload,
  createAction as createActionOrigin,
} from '@reduxjs/toolkit';

export function createAction<P, T extends string = string>(
  type: T,
  prefix?: string,
): ActionCreatorWithOptionalPayload<P, T> {
  let typeWithPrefix: any = type;
  if (prefix) {
    typeWithPrefix = '+' + prefix + '/' + typeWithPrefix;
  }

  return createActionOrigin<any, any>(typeWithPrefix);
}

export function generateAction<
  // eslint-disable-next-line @typescript-eslint/ban-types
  ActionPayload = {},
  AfterPayload = { data: any },
  ErrorPayload = { error: any },
  T extends string = string,
>(
  type: T,
  prefix?: string,
): {
  ACTION: ActionCreatorWithOptionalPayload<ActionPayload, T>;
  AFTER: ActionCreatorWithOptionalPayload<AfterPayload, T>;
  ERROR: ActionCreatorWithOptionalPayload<ErrorPayload, T>;
} {
  return {
    ACTION: createActionOrigin<any, any>(
      createGeneralActionType(type, prefix).ACTION,
    ),
    AFTER: createActionOrigin<any, any>(
      createGeneralActionType(type, prefix).AFTER,
    ),
    ERROR: createActionOrigin<any, any>(
      createGeneralActionType(type, prefix).ERROR,
    ),
  };
}

export const createGeneralActionType = (type: string, prefix?: string) => ({
  ACTION: prefix ? '+' + prefix + '/' + type + '_ACTION' : type + '_ACTION',
  BEFORE: prefix ? '+' + prefix + '/' + type + '_ACTION' : type + '_ACTION',
  AFTER: prefix
    ? '+' + prefix + '/' + type + '_AFTER_ACTION'
    : type + '_AFTER_ACTION',
  ERROR: prefix
    ? '+' + prefix + '/' + type + '_ERROR_ACTION'
    : type + '_ERROR_ACTION',
});
