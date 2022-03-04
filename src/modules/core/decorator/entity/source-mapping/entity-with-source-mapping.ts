import 'reflect-metadata';

// eslint-disable-next-line @typescript-eslint/ban-types
export function EntityWithSourceMapping<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  constructor.prototype.convertSourceData = (data: any) => {
    return { ...data };
  };
}

const sourceMappingMetadataKey = Symbol('ENTITY_SOURCE_MAPPING');

export function SourceMapping(key: string) {
  return function (target: any, propertyName: string) {
    Reflect.defineMetadata(sourceMappingMetadataKey, key, target, propertyName);
  };
}
