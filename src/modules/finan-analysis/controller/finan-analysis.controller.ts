import { Controller, Get } from '@nestjs/common';
import { TestPublisher } from '@module/finan-analysis/queue/publisher/test.publisher';
import { BetaPublisher } from '@module/finan-analysis/queue/publisher/compute/ge/beta.publisher';
import { BetaService } from '@module/finan-analysis/service/compute/ge/beta.service';
import { GrossProfitPublisher } from '@module/finan-analysis/queue/publisher/compute/fundamental-analysis/gross-profit.publisher';

@Controller('fa')
export class FinanAnalysisController {
  constructor(
    private betaPublisher: BetaPublisher,
    private faBetaService: BetaService,
    private testPublisher: TestPublisher,
    private grossProfitPublisher: GrossProfitPublisher,
  ) {}

  @Get('/test')
  async test() {
    return this.grossProfitPublisher.publishCalculateSector();
  }

  @Get('/cal-beta')
  async calBeta() {
    return this.betaPublisher.publish();
  }

  @Get('/update-beta')
  async updateBeta() {
    this.faBetaService.updateBeta();
  }
}
