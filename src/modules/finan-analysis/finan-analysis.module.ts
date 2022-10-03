import { Module } from '@nestjs/common';
import { FinanInfoModule } from '@module/finan-info/finan-info.module';
import { FinanAnalysisController } from '@module/finan-analysis/controller/finan-analysis.controller';
import { ANALYSIS_QUEUE } from '@module/finan-analysis/queue';
import { CoreModule } from '@module/core/core.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinanAnalysisEntities } from '@module/finan-analysis/entity';
import { FA_SERVICES } from '@module/finan-analysis/service';
import { ComputeController } from '@module/finan-analysis/controller/compute.controller';

@Module({
  imports: [
    CoreModule,
    FinanInfoModule,
    TypeOrmModule.forFeature([...FinanAnalysisEntities]),
  ],
  controllers: [FinanAnalysisController, ComputeController],
  providers: [...FA_SERVICES, ...ANALYSIS_QUEUE],
})
export class FinanAnalysisModule {}
