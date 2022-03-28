import { Controller, Get } from '@nestjs/common';
import { BetaPublisher } from '@module/finan-analysis/queue/publisher/beta.publisher';

@Controller('fa')
export class FinanAnalysisController {
  constructor(private betaPublisher: BetaPublisher) {}

  @Get('/test')
  async test() {
    return this.betaPublisher.publish();
  }
}
