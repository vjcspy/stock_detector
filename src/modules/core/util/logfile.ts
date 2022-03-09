import moment from 'moment';
import * as winston from 'winston';
import { format } from 'winston';

import stringify from 'json-stringify-safe';

const {
  combine,
  simple,
  splat,
  // errors,
  // cli,
  colorize,
  metadata,
} = format;

const addTimeStamp = format((info: any) => {
  info.message = `${moment().format(' YYYY-MM-DD, HH:mm:ss ')} [${
    info?.metadata?.context ?? ''
  }] : ${info.message}`;

  return info;
});

export const initDefaultLogger = () => {
  return winston.createLogger({
    // level: 'silly',
    // levels: winston.config.cli.levels,
    format: combine(
      splat(),
      simple(),
      metadata(),
      colorize(),
      addTimeStamp(),
      format.printf((info) => `${info.message}`),
      // errors(),
      // formatMetadata()
    ),
    transports: [],
  });
};

export const fileLogger = () => {
  const _logger = initDefaultLogger();

  const trans = [
    // new winston.transports.Console({}),

    new winston.transports.File({
      filename: `logs/info.log`,
      level: 'info',
    }),
    new winston.transports.File({
      filename: `logs/error.log`,
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ];

  trans.forEach((tran) => _logger.add(tran));

  return _logger;
};
