import { MongoModuleOptions } from '../mongo';
import { ConfigurableModuleOptionsFactory, Injectable } from '@nestjs/common';

@Injectable()
export class Db1Config
  implements ConfigurableModuleOptionsFactory<MongoModuleOptions, 'create'>
{
  create(): Promise<MongoModuleOptions> | MongoModuleOptions {
    return {
      connectionConfigs: {
        uri: 'mongodb://localhost:27017',
        alternativeDatabaseName: 'db1',
      },
      serviceName: 'service1',
    };
  }
}
