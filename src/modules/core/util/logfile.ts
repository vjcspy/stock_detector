import moment from 'moment';
import * as winston from 'winston';
import { format } from 'winston';

import process from 'process';
import { TransformableInfo } from 'logform';

const {
  combine,
  simple,
  splat,
  errors,
  // cli,
  colorize,
  metadata,
} = format;

const addTimeStamp = format((info: TransformableInfo) => {
  info.message = `${moment().format(' YYYY-MM-DD, HH:mm:ss ')} [${
    info?.metadata?.context ?? process.pid
  }] : ${info.message}`;

  return info;
});

export const initDefaultLogger = (filePath?: string) => {
  const _logger = winston.createLogger({
    level: 'silly',
    // levels: winston.config.cli.levels,
    format: combine(
      // splat(),
      // simple(),
      // metadata(),
      // addTimeStamp(),
      // format.printf((info) => `${info.message}`),
      // errors(),
      // formatMetadata()
      winston.format.colorize(),
      winston.format.simple(),
    ),
    transports: [],
  });

  if (typeof filePath !== 'undefined') {
    const trans = [
      new winston.transports.File({ filename: `logs/${filePath}` }),
    ];

    trans.forEach((tran) => _logger.add(tran));
  }

  return _logger;
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
