import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Logger,
  Module,
} from '@nestjs/common';
import { MongooseModule, MongooseModuleFactoryOptions } from '@nestjs/mongoose';

import { CommonDynamicModuleOptions, MongoModuleOptions } from './interfaces';

const {
  ConfigurableModuleClass,
  ASYNC_OPTIONS_TYPE,
  MODULE_OPTIONS_TOKEN: MONGO_MODULE_OPTIONS,
} = new ConfigurableModuleBuilder<MongoModuleOptions>().build();

export const {
  ConfigurableModuleClass: TempModuleConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN: TEMP_TOKEN,
  ASYNC_OPTIONS_TYPE: TEMP_ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder().build();

export class TempModule extends TempModuleConfigurableModuleClass {}

@Module({})
export class MongoModule extends ConfigurableModuleClass {
  private static readonly logger = new Logger(MongoModule.name);

  static registerAsync(
    options: typeof ASYNC_OPTIONS_TYPE & CommonDynamicModuleOptions,
  ): DynamicModule {
    const module = super.registerAsync(options);

    module.imports ??= [];
    module.imports.push(
      TempModule.registerAsync({
        useFactory: (mongoModuleOptions: MongoModuleOptions) => {
          // But having mongoModuleOptions here does not help me with MongooseModule!
          return;
        },
        inject: [MONGO_MODULE_OPTIONS],
        provideInjectionTokensFrom: module.providers,
      }),
      MongooseModule.forRootAsync({
        useFactory: (
          mongoModuleOptions: MongoModuleOptions,
        ): MongooseModuleFactoryOptions => {
          const { connectionConfigs, serviceName } = mongoModuleOptions;
          const uri = new URL(connectionConfigs.uri);

          if (connectionConfigs.alternativeDatabaseName) {
            uri.pathname = uri.pathname.replace(
              serviceName,
              connectionConfigs.alternativeDatabaseName,
            );
          }

          if (connectionConfigs.authMechanism) {
            uri.searchParams.append(
              'authMechanism',
              connectionConfigs.authMechanism,
            );
          }

          MongoModule.logger.log(`Connecting to MongoDB at ${uri}`);

          return {
            uri: uri.href,
            user: connectionConfigs.username,
            pass: connectionConfigs.password,
            tlsCAFile: connectionConfigs.tlsCaFile,
            tls: connectionConfigs.isTlsEnabled ?? false,
          };
        },
        inject: [MONGO_MODULE_OPTIONS],
        connectionName: options.connectionName,
      }),
    );

    return module;
  }
}
