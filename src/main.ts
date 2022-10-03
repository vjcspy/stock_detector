import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SlackService } from '@module/core/service/slack.service';
import { WinstonModule, utilities } from 'nest-winston';
import winston from 'winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // https://github.com/gremo/nest-winston#replacing-the-nest-logger-also-for-bootstrapping
    logger: WinstonModule.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            utilities.format.nestLike(process.env.INSTANCE_ID ?? '0', {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new winston.transports.File({
          filename: `logs/info.log`,
          level: 'info',
        }),
        new winston.transports.File({
          filename: `logs/error.log`,
          level: 'error',
        }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
      ],
    }),
  });
  const configService = app.get(ConfigService);

  // Config Slack
  const slack = app.get(SlackService);
  if (slack.isReady()) {
    app.use('/slack/events', slack.use());
  }

  await app.listen(configService.get('PORT'));
}
bootstrap();
