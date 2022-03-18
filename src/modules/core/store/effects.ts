import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import { appInitAction } from '@module/core/store/actions';
import { map } from 'rxjs';
import { Effect } from '@module/core/decorator/store-effect';
import { Injectable } from '@nestjs/common';
import { LogDbService } from '../service/log-db.service';

export const CORE_EFFECTS = [];

@Injectable()
export class CoreEffects {
  constructor(private logDbService: LogDbService) {}

  @Effect()
  init = createEffect((action$) =>
    action$.pipe(
      ofType(appInitAction.ACTION),
      map(() => {
        this.logDbService.log({
          source: 'APP',
          message: 'App initialized',
          group: 'info',
        });
        return appInitAction.AFTER();
      }),
    ),
  );
}
