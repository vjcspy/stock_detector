import { combineReducers, Reducer, ReducersMapObject } from 'redux';
// import logger from 'redux-logger';
import {
  combineEpics,
  createEpicMiddleware,
  StateObservable,
} from 'redux-observable';
import { BehaviorSubject, Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

let epic$: any;
let rootEpic: any;
let rootMiddleware: any[] = [];
// An array which is used to delete state keys when reducers are removed
let keysToRemove: string[] = [];

// check existed appName when addEpic
const epicAppName: string[] = [];

export function createStoreManager(
  initialReducers: ReducersMapObject<any, any>,
  rootEffects: any[] = [],
  middlewares: any[] = [],
) {
  // Create an object which maps keys to reducers
  const reducers = { ...initialReducers };

  // Create the initial combinedReducer
  let combinedReducer = combineReducers(reducers);

  // Config Effects
  /*
   * Trong document của nó nói sử dụng BehaviorSubject nhưng nếu như thế sẽ bị lỗi chỉ chạy thằng epic cuối cùng
   * Với cách sử dụng cũ là add mọi thứ vào rootEffects thì lại work, hoặc ít nhất là rootEffects không empty thì OK
   * */
  epic$ = new BehaviorSubject(combineEpics(...rootEffects));
  rootEpic = (action$: Observable<any>, state$: StateObservable<any>) =>
    epic$.pipe(mergeMap((epic: any) => epic(action$, state$, undefined)));

  const effectMiddleware = createEpicMiddleware();

  rootMiddleware = [...rootMiddleware, effectMiddleware, ...middlewares];

  return {
    middleware: () => rootMiddleware,
    getReducerMap: () => reducers,

    /**
     * react-redux-observable require run this method after created store
     */
    runEpic: () => effectMiddleware.run(rootEpic),

    addEpics: (appName: string, epics: any[]) => {
      if (epicAppName.includes(appName)) {
        console.warn('We already added epic for app with name: ' + appName);
        return;
      }
      epicAppName.push(appName);
      epics.forEach((epic) => epic$.next(epic));
    },

    // The root reducer function exposed by this object
    // This will be passed to the store
    reduce: (state: any, action: any) => {
      // If any reducers have been removed, clean up their state first
      if (keysToRemove.length > 0) {
        state = { ...state };
        for (const key of keysToRemove) {
          delete state[key];
        }
        keysToRemove = [];
      }

      // Delegate to the combined reducer
      return combinedReducer(state, action);
    },

    // Adds a new reducer with the specified key
    add: (key: string, reducer: Reducer<any>) => {
      if (!key || reducers[key]) {
        return;
      }

      // Add the reducer to the reducer mapping
      reducers[key] = reducer;

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers);
    },

    mergeReducers: (objectReducer: any) => {
      Object.entries(objectReducer).forEach(([key, reducer]) => {
        if (!key || reducers[key]) {
          return;
        }

        // Add the reducer to the reducer mapping
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        reducers[key] = reducer;

        // Generate a new combined reducer
        combinedReducer = combineReducers(reducers);
      });
    },

    // Removes a reducer with the specified key
    remove: (key: string) => {
      if (!key || !reducers[key]) {
        return;
      }

      // Remove it from the reducer mapping
      delete reducers[key];

      // Add the key to the list of keys to clean up
      keysToRemove.push(key);

      // Generate a new combined reducer
      combinedReducer = combineReducers(reducers);
    },
  };
}
