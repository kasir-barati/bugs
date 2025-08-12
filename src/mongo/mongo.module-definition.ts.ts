import { ConfigurableModuleBuilder } from '@nestjs/common';

import { MongoModuleOptions } from './interfaces';

export const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: MONGO_MODULE_OPTIONS,
  ASYNC_OPTIONS_TYPE: MongoModuleAsyncOptions,
} = new ConfigurableModuleBuilder<MongoModuleOptions>().build();

export class MongoOptionsModule extends ConfigurableModuleClass {}
