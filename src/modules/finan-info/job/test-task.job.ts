import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CronScheduleService } from '@module/core/service/cron-schedule.service';

@Injectable()
export class TestTaskJob {
  // static JOB_CODE = 'test-task';
  // private readonly logger = new Logger(TestTaskJob.name);
  // constructor(private cronScheduleService: CronScheduleService) {}
  //
  // // @Cron(CronExpression.EVERY_MINUTE, {
  // //   name: TestTaskJob.JOB_CODE,
  // //   timeZone: 'Asia/Ho_Chi_Minh',
  // // })
  // // async handleCron() {
  // //   await this.cronScheduleService.runOneTimePerDay(
  // //     TestTaskJob.JOB_CODE,
  // //     async () => {
  // //       this.logger.debug(
  // //         'Called ----------- TestTaskJob run one time per day',
  // //       );
  // //     },
  // //   );
  // // }
}
