import { Injectable, Logger } from '@nestjs/common';
import { CorEntity } from '@module/finan-info/entity/cor.entity';
import { StateManager } from '@module/core/provider/state-manager';
import { startSyncCor } from '@module/finan-info/store/corporation/sync-cor.actions';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { isFirstProcessPm2 } from '@module/core/util/env';

@Injectable()
export class CorService {
  static get corRepo(): Repository<CorEntity> {
    return this._corRepo ?? CorEntity.getRepository();
  }
  private static _corRepo: Repository<CorEntity>;
  private readonly logger = new Logger(CorService.name);

  constructor(
    protected stateManager: StateManager,
    @InjectRepository(CorEntity)
    private corRepository: Repository<CorEntity>,
  ) {}

  public async initCor() {
    const existed = (await this.corRepository.count()) > 0;

    if (!existed && isFirstProcessPm2()) {
      this.logger.log('Empty corporation data. Do initialize...');
      this.stateManager.getStore().dispatch(startSyncCor());
    }
  }
}
