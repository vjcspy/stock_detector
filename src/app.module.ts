import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanInfoModule } from '@module/finan-info/finan-info.module';
import { CoreModule } from '@module/core/core.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'vm',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nstock',
      autoLoadEntities: true,
      synchronize: true,
    }),
    CoreModule,
    FinanInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
