import { catchError, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  corGetNextPageAction,
  corGetNextPageAfterAction,
  corGetNextPageErrorAction,
  startSyncCor,
} from './sync-cor.actions';
import { SyncCorState } from './sync-cor.state';
import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import { corGetPageFn } from '@module/finan-info/store/corporation/funcs/corGetPage';

const whenAppInit$ = createEffect((action$) =>
  action$.pipe(
    ofType(startSyncCor),
    map(() => corGetNextPageAction()),
  ),
);

const loadNextPage$ = createEffect((action$, state$) =>
  action$.pipe(
    ofType(corGetNextPageAction),
    withLatestFrom(state$, (v1, v2) => [v1, v2.syncCor]),
    switchMap((data: any) => {
      const syncCorState: SyncCorState = data[1];
      const currentPage = syncCorState.page;
      return from(corGetPageFn(currentPage + 1)).pipe(
        map((data: any) => {
          if (
            data &&
            data?.numOfRecords &&
            data?.affectedRows &&
            data.numOfRecords === data.affectedRows
          ) {
            return corGetNextPageAfterAction({
              page: currentPage + 1,
              numOfRecords: data?.numOfRecords,
              runNextPage: data?.numOfRecords === 50,
            });
          } else {
            return corGetNextPageErrorAction({
              error: new Error('run time error'),
            });
          }
        }),
      );
    }),
    catchError((error: any) =>
      of(
        corGetNextPageErrorAction({
          error,
        }),
      ),
    ),
  ),
);

const repeatLoad$ = createEffect((action$) =>
  action$.pipe(
    ofType(corGetNextPageAfterAction),
    filter((action) => action.payload.runNextPage === true),
    map(() => corGetNextPageAction()),
  ),
);

export const syncCorEffects = [whenAppInit$, loadNextPage$, repeatLoad$];
