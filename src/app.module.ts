import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FinanInfoModule } from './modules/finan-info/finan-info.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'nstock',
      autoLoadEntities: true,
      synchronize: true,
    }),
    FinanInfoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
