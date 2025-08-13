import { Module } from '@nestjs/common';
import { MongoModule } from './mongo';
import { Db1Config } from './configs/db1.config';

@Module({
  imports: [
    MongoModule.registerAsync({
      global: false,
      connectionName: 'db1',
      useClass: Db1Config,
    }),
  ],
})
export class AppModule {}
