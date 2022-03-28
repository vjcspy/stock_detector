import { Controller, Get } from '@nestjs/common';
import { BetaPublisher } from '@module/finan-analysis/queue/publisher/beta.publisher';
import { BetaService } from '../service/beta.service';

@Controller('fa')
export class FinanAnalysisController {
  constructor(
    private betaPublisher: BetaPublisher,
    private faBetaService: BetaService,
  ) {}

  @Get('/test')
  async test() {
    return this.betaPublisher.publish();
  }

  @Get('/update-beta')
  async updateBeta() {
    this.faBetaService.updateBeta();
  }
}
