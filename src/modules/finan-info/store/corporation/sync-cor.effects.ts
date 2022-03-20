import { catchError, from, map, of, switchMap, withLatestFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

import {
  corGetNextPageAction,
  corGetNextPageAfterAction,
  corGetNextPageErrorAction,
  finishSyncCor,
  startSyncCor,
} from './sync-cor.actions';
import { SyncCorState } from './sync-cor.state';
import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import { corGetPageFn } from '@module/finan-info/store/corporation/funcs/corGetPage';
import { Injectable } from '@nestjs/common';
import { Effect } from '@module/core/decorator/store-effect';
import { LogService } from '@module/core/service/log.service';
import { Levels } from '@module/core/schemas/log-db.schema';

@Injectable()
export class SyncCorEffects {
  constructor(private log: LogService) {}

  @Effect()
  whenAppInit$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(startSyncCor),
      withLatestFrom(state$, (v1, v2) => [v1, v2.syncCor]),
      filter((data: any) => {
        const syncCorState: SyncCorState = data[1];

        return syncCorState.running !== true;
      }),
      map(() => {
        this.log.log({
          source: 'fi',
          group: 'sync_cor',
          message: '________________ start sync cors ________________',
        });
        return corGetNextPageAction();
      }),
    ),
  );

  @Effect()
  loadNextPage$ = createEffect((action$, state$) =>
    action$.pipe(
      ofType(corGetNextPageAction),
      withLatestFrom(state$, (v1, v2) => [v1, v2.syncCor]),
      switchMap((data: any) => {
        const syncCorState: SyncCorState = data[1];
        const currentPage = syncCorState.page;
        this.log.log({
          source: 'fi',
          group: 'sync_cor',
          message: `get Cor Page: ${currentPage + 1}`,
        });
        return from(corGetPageFn(currentPage + 1)).pipe(
          map((data: any) => {
            if (
              data &&
              !isNaN(data?.numOfRecords) &&
              !isNaN(data?.affectedRows)
            ) {
              if (data?.numOfRecords === 0 || data?.numOfRecords < 50) {
                this.log.log({
                  source: 'fi',
                  group: 'sync_cor',
                  message: `________________ finished ________________`,
                  metadata: {
                    numOfRecords: data?.numOfRecords,
                  },
                });
                return finishSyncCor();
              }

              this.log.log({
                source: 'fi',
                group: 'sync_cor',
                message: `Save success Page: ${currentPage + 1}`,
              });

              return corGetNextPageAfterAction({
                page: currentPage + 1,
                numOfRecords: data?.numOfRecords,
                runNextPage: data?.numOfRecords === 50,
              });
            } else {
              this.log.log({
                level: Levels.error,
                source: 'fi',
                group: 'sync_cor',
                message: `Save Error Page: ${currentPage + 1}`,
              });

              return corGetNextPageErrorAction({
                error: new Error('run time error'),
              });
            }
          }),
        );
      }),
      catchError((error: any) => {
        this.log.log({
          level: Levels.error,
          source: 'fi',
          group: 'sync_cor',
          message: `Save Error, check metadata`,
          metadata: {
            error,
          },
        });
        return of(
          corGetNextPageErrorAction({
            error,
          }),
        );
      }),
    ),
  );

  @Effect()
  repeatLoad$ = createEffect((action$) =>
    action$.pipe(
      ofType(corGetNextPageAfterAction),
      filter((action) => action.payload.runNextPage === true),
      map(() => corGetNextPageAction()),
    ),
  );
}
