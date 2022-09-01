export const isDevelopment = () =>
  process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'dev';

export const isFirstProcessPm2 = () =>
  (typeof process.env.INSTANCE_ID === 'undefined' && !process.env.PM2) ||
  process.env.INSTANCE_ID === '0';
