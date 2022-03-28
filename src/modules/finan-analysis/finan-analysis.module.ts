import { Module } from '@nestjs/common';
import { ANALYZE_PROVIDERS } from '@module/finan-analysis/analyze';
import { FinanInfoModule } from '@module/finan-info/finan-info.module';
import { FinanAnalysisController } from '@module/finan-analysis/controller/finan-analysis.controller';
import { ANALYSIS_QUEUE } from '@module/finan-analysis/queue';
import { CoreModule } from '@module/core/core.module';

@Module({
  imports: [CoreModule, FinanInfoModule],
  controllers: [FinanAnalysisController],
  providers: [...ANALYZE_PROVIDERS, ...ANALYSIS_QUEUE],
})
export class FinanAnalysisModule {}
