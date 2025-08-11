import { Module } from '@nestjs/common';
import { MongoModule } from './mongo';
import { Db1Config } from './configs/db1.config';

@Module({
  imports: [
    // FIXME: The registerAsync does not work!
    MongoModule.registerAsync({
      global: false,
      connectionName: 'db1',
      useClass: Db1Config,
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
