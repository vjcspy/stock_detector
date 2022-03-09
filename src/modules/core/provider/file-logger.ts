import { ConsoleLogger } from '@nestjs/common';
import { fileLogger } from '@module/core/util/logfile';

export class FileLogger extends ConsoleLogger {
  private static LOGGER_INSTANCE = fileLogger();
  log(message: any, context?: string) {
    FileLogger.LOGGER_INSTANCE.info(message, { context });
    super.log(message, context);
  }
}
