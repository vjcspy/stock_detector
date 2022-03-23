import { Injectable } from '@nestjs/common';
import { LogService } from '@module/core/service/log.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SyncFinancialInfoJob {
  constructor(
    private log: LogService,
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
  ) {}

  @Cron('0 10 0 * * *', {
    name: 'fi_sync_bs_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  indicatorYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_in_year',
      message: 'Trigger sync Indicator year',
    });
  }

  @Cron('0 10 1 * * *', {
    name: 'fi_sync_bs_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  indicatorQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_in_quarter',
      message: 'Trigger sync Indicator quarter',
    });
  }

  @Cron('0 10 0 * * *', {
    name: 'fi_sync_bs_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  balanceSheetYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_bs_year',
      message: 'Trigger sync Balance Sheet year',
    });
  }

  @Cron('0 10 1 * * *', {
    name: 'fi_sync_bs_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  balanceSheetQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_bs_quarter',
      message: 'Trigger sync Balance Sheet quarter',
    });
  }

  @Cron('0 10 2 * * *', {
    name: 'fi_sync_br_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  businessReportYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_br_year',
      message: 'Trigger sync Business Report year',
    });
  }

  @Cron('0 0 3 * * *', {
    name: 'fi_sync_br_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  businessReportQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_br_quarter',
      message: 'Trigger sync Business Report quarter',
    });
  }

  @Cron('0 10 4 * * *', {
    name: 'fi_sync_cf_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  cashFlowYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_cf_year',
      message: 'Trigger sync Cash Flow year',
    });
  }

  @Cron('0 10 5 * * *', {
    name: 'fi_sync_cf_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  cashFlowQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_cf_quarter',
      message: 'Trigger sync Cash Flow quarter',
    });
  }
}
