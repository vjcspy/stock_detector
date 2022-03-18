import 'reflect-metadata';
import { Map } from 'immutable';
import _ from 'lodash';

/*
 * Decorator class
 * */
// eslint-disable-next-line @typescript-eslint/ban-types
export function EntityWithSourceMapping<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  // NOTE: bắt buộc phải sử dụng this, trong context của object
  constructor.prototype.convertSourceData = function (
    data: any,
    plainObject = true,
  ) {
    if (typeof data !== 'object') {
      return null;
    }

    const sourceMappingMetadata: Map<string, any> = Reflect.getMetadata(
      sourceMappingMetadataKey,
      this,
    );
    const convertData: any = {};

    // _.forEach(data, (value: any, key: string) => {
    // const _propertyName = sourceMappingMetadata.get(key);
    // if (typeof _propertyName === 'string') {
    //   convertData[_propertyName] = value;
    // }
    // });

    sourceMappingMetadata.forEach((propertyOrObjectMapping, sourceKey) => {
      if (typeof propertyOrObjectMapping === 'string') {
        convertData[propertyOrObjectMapping] = data[sourceKey] ?? null;
      } else if (
        typeof propertyOrObjectMapping?.convertFn === 'function' &&
        typeof propertyOrObjectMapping?.propertyName === 'string'
      ) {
        convertData[propertyOrObjectMapping.propertyName] =
          propertyOrObjectMapping.convertFn(data);
      } else {
        throw new Error(`SourceMapping error with key: ${sourceKey}`);
      }
    });

    if (plainObject === false) {
      _.forEach(convertData, (_v, _k) => {
        this[_k] = _v;
      });

      return this;
    }

    return convertData;
  };
}

const sourceMappingMetadataKey = Symbol('ENTITY_SOURCE_MAPPING');

/**
 * Decorator for entity property
 * @param key
 * @param convertFn
 * @returns {(target: any, propertyName: string) => void}
 * @constructor
 */
export function SourceMapping(key: string, convertFn?: (data: any) => any) {
  return function (target: any, propertyName: string) {
    let sourceMappingMetadata: Map<string, any> = Reflect.getMetadata(
      sourceMappingMetadataKey,
      target,
    );
    if (!Map.isMap(sourceMappingMetadata)) {
      sourceMappingMetadata = Map();
    }
    sourceMappingMetadata = sourceMappingMetadata.set(
      key ?? propertyName,
      typeof convertFn === 'function'
        ? { propertyName, convertFn }
        : propertyName,
    );

    Reflect.defineMetadata(
      sourceMappingMetadataKey,
      sourceMappingMetadata,
      target,
    );
  };
}
