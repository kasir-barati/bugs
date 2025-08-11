import { MongoModuleAsyncOptionsFactory, MongoModuleOptions } from '../mongo';
import { Injectable } from '@nestjs/common';

@Injectable()
export class Db1Config implements MongoModuleAsyncOptionsFactory {
  createMongoModuleOptions(): Promise<MongoModuleOptions> | MongoModuleOptions {
    return {
      connectionConfigs: { uri: '', alternativeDatabaseName: 'db1' },
      serviceName: 'service1',
    };
  }
}
