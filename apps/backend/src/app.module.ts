import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongoModule } from './database/mongo.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule,
    MongoModule,
    HealthModule,
  ],
})
export class AppModule {}