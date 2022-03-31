import { Controller, Get } from '@nestjs/common';
import { BetaPublisher } from '@module/finan-analysis/queue/publisher/beta.publisher';
import { BetaService } from '../service/beta.service';
import { TestPublisher } from '@module/finan-analysis/queue/publisher/test.publisher';

@Controller('fa')
export class FinanAnalysisController {
  constructor(
    private betaPublisher: BetaPublisher,
    private faBetaService: BetaService,
    private testPublisher: TestPublisher,
  ) {}

  @Get('/test')
  async test() {
    return this.testPublisher.publish();
  }

  @Get('/update-beta')
  async updateBeta() {
    this.faBetaService.updateBeta();
  }
}
