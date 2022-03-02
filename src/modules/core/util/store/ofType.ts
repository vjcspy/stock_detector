import { PayloadActionCreator } from '@reduxjs/toolkit';
import { OperatorFunction, pipe } from 'rxjs';
import { filter } from 'rxjs/operators';

export const ofType: (
  ...allowedTypes: Array<string | PayloadActionCreator<any>>
) => OperatorFunction<{ type: string }, { type: string; payload?: any }> = (
  ...allowedTypes
) => {
  const type: string[] = allowedTypes.map((a) =>
    typeof a === 'string' ? a : a.type,
  );

  return pipe(filter((action) => type.includes(action.type)));
};
