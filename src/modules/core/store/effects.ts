import { createEffect } from '@module/core/util/store/createEffect';
import { ofType } from '@module/core/util/store/ofType';
import { appInitAction } from '@module/core/store/actions';
import { map } from 'rxjs';

const appInitAfter$ = createEffect((action$) =>
  action$.pipe(
    ofType(appInitAction.ACTION),
    map(() => appInitAction.AFTER()),
  ),
);

export const CORE_EFFECTS = [appInitAfter$];
