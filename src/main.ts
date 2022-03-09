import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { FileLogger } from '@module/core/provider/file-logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new FileLogger(),
  });
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
