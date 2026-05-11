import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { MongoModule } from './database/mongo.module';
import { HealthModule } from './modules/health/health.module';
import { PokemonModule } from './modules/pokemon/pokemon.module';
import { CollectionsModule } from './modules/collections/collections.module';

@Module({
  imports: [
    ConfigModule,
    MongoModule,
    HealthModule,
    PokemonModule,
    CollectionsModule,
    CollectionsModule,
  ],
})
export class AppModule {}
