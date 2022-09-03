import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FileLogger } from '@module/core/provider/file-logger';
import { SlackService } from '@module/core/service/slack.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new FileLogger(),
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
