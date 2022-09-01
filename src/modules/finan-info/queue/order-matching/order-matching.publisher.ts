import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { InjectRepository } from '@nestjs/typeorm';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { Repository } from 'typeorm';
import _ from 'lodash';
import { FinancialInfoValues } from '@module/finan-info/store/financial-info/financial-info.values';
import { JobSyncStatusService } from '@module/finan-info/service/job-sync-status.service';

export class OrderMatchingPublisher {
  constructor(
    private readonly amqpConnection: AmqpConnection,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
    private jobSyncStatusService: JobSyncStatusService,
  ) {}

  async publish() {
    await this.jobSyncStatusService.clearWithPrefix('sync_om_');

    const cors = await this.corRepository.find();
    _.forEach(cors, (cor) => {
      this.amqpConnection.publish(
        FinancialInfoValues.EXCHANGE_KEY,
        FinancialInfoValues.ORDER_MATCHING_KEY,
        cor.code,
        {},
      );
    });

    return {
      size: cors.length,
    };
  }
}
