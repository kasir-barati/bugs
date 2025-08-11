import { MongoModuleAsyncOptionsFactory, MongoModuleOptions } from '../mongo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Db1Config implements MongoModuleAsyncOptionsFactory {
  createMongoModuleOptions(): Promise<MongoModuleOptions> | MongoModuleOptions {
    return {
      connectionConfigs: {
        uri: 'mongodb://localhost:27017',
        alternativeDatabaseName: 'db1',
      },
      serviceName: 'service1',
    };
  }
}
