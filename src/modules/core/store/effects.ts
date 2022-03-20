import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import { appInitAction } from '@module/core/store/actions';
import { map } from 'rxjs';
import { Effect } from '@module/core/decorator/store-effect';
import { Injectable } from '@nestjs/common';
import { LogService } from '@module/core/service/log.service';

@Injectable()
export class CoreEffects {
  constructor(private logDbService: LogService) {}

  @Effect()
  init = createEffect((action$) =>
    action$.pipe(
      ofType(appInitAction.ACTION),
      map(() => {
        this.logDbService.log({
          source: 'APP',
          message: 'App initialized',
          group: 'general',
        });
        return appInitAction.AFTER();
      }),
    ),
  );
}
