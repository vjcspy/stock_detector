import 'reflect-metadata';
import { List } from 'immutable';

export const EFFECT_PROPERTY_KEY = Symbol('EFFECT_PROPERTY_KEY');

/**
 *
 * @param target
 * @param propertyName
 * @constructor
 */
export function Effect() {
  return function (target: any, propertyName: string) {
    // property decorator for Effect Service
    let propertyEffectMetadata: List<string> = Reflect.getMetadata(
      EFFECT_PROPERTY_KEY,
      target,
    );

    if (!List.isList(propertyEffectMetadata)) {
      propertyEffectMetadata = List();
    }

    propertyEffectMetadata = propertyEffectMetadata.push(propertyName);

    Reflect.defineMetadata(EFFECT_PROPERTY_KEY, propertyEffectMetadata, target);
  };
}
