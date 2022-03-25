import { Module } from '@nestjs/common';
import { ANALYZE_PROVIDERS } from '@module/finan-analysis/analyze';

@Module({
  providers: [...ANALYZE_PROVIDERS],
})
export class FinanAnalysisModule {}
