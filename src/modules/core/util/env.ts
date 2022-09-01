export const isDevelopment = () =>
  process.env.ENV === 'development' || process.env.ENV === 'dev';

export const isFirstProcessPm2 = () =>
  (typeof process.env.INSTANCE_ID === 'undefined' && !process.env.PM2) ||
  process.env.INSTANCE_ID === '0';
