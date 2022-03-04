// eslint-disable-next-line @typescript-eslint/ban-types
export function entityWithSourceMapping<T extends { new (...args: any[]): {} }>(
  constructor: T,
) {
  constructor.prototype.convertSourceData = (data: any) => {
    return { ...data };
  };
}
