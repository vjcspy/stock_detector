import 'reflect-metadata';
import { Map } from 'immutable';
import _ from 'lodash';

/**
 *
 * @param target
 * @param propertyName
 * @constructor
 */
export function Effect() {
  return function (target: any, propertyName: string) {
    // property decorator for Effect Service
    console.log('Effect here');
  };
}
