import { Injectable } from '@nestjs/common';
import { LogService } from '@module/core/service/log.service';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import { Cron } from '@nestjs/schedule';
import _ from 'lodash';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';

@Injectable()
export class SyncFinancialInfoJob {
  constructor(
    private log: LogService,
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
  ) {}

  /* INDICATOR */
  @Cron('0 10 22 1 * *', {
    name: 'fi_sync_in_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async indicatorYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_in_year',
      message: 'Trigger sync Indicator year',
    });
    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_INDICATOR_YEAR,
        cor.code,
        {},
      );
    });
  }

  @Cron('0 10 23 1 * *', {
    name: 'fi_sync_in_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async indicatorQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_in_quarter',
      message: 'Trigger sync Indicator quarter',
    });
    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_INDICATOR_QUARTER,
        cor.code,
        {},
      );
    });
  }

  /* BALANCE SHEET */
  @Cron('0 10 0 1 * *', {
    name: 'fi_sync_bs_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async balanceSheetYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_bs_year',
      message: 'Trigger sync Balance Sheet year',
    });

    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_BS_YEAR,
        cor.code,
        {},
      );
    });
  }

  @Cron('0 10 1 1 * *', {
    name: 'fi_sync_bs_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async balanceSheetQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_bs_quarter',
      message: 'Trigger sync Balance Sheet quarter',
    });
    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_BS_QUARTER,
        cor.code,
        {},
      );
    });
  }

  /* BUSINESS REPORT */
  @Cron('0 10 2 1 * *', {
    name: 'fi_sync_br_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async businessReportYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_br_year',
      message: 'Trigger sync Business Report year',
    });

    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_BR_YEAR,
        cor.code,
        {},
      );
    });
  }

  @Cron('0 0 3 1 * *', {
    name: 'fi_sync_br_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async businessReportQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_br_quarter',
      message: 'Trigger sync Business Report quarter',
    });

    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_BR_QUARTER,
        cor.code,
        {},
      );
    });
  }

  /* CASH FLOW */
  @Cron('0 10 4 1 * *', {
    name: 'fi_sync_cf_year',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async cashFlowYear() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_cf_year',
      message: 'Trigger sync Cash Flow year',
    });

    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_CF_YEAR,
        cor.code,
        {},
      );
    });
  }

  @Cron('0 10 5 1 * *', {
    name: 'fi_sync_cf_quarter',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async cashFlowQuarter() {
    this.log.log({
      source: 'cron',
      group: 'fi',
      group1: 'sync_cf_quarter',
      message: 'Trigger sync Cash Flow quarter',
    });

    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.PUBLISHER_ROUTING_KEY_CF_QUARTER,
        cor.code,
        {},
      );
    });
  }
}
