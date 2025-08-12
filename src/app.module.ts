import { Module } from '@nestjs/common';
import { MongoModule, MongoOptionsModule } from './mongo';
import { Db1Config } from './configs/db1.config';

@Module({
  imports: [
    MongoOptionsModule.registerAsync({
      useClass: Db1Config,
    }),
    MongoModule.registerAsync({
      global: false,
      connectionName: 'db1',
    }),
    MongoModule.register({
      global: false,
      connectionName: 'db1',
      connectionConfigs: {
        uri: 'mongodb://localhost:27017',
        alternativeDatabaseName: 'db1',
      },
      serviceName: 'service1',
    }),
  ],
})
export class AppModule {}
