import {
  ConfigurableModuleBuilder,
  DynamicModule,
  Logger,
  Module,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CommonDynamicModuleOptions, MongoModuleOptions } from './interfaces';

const {
  ConfigurableModuleClass,
  ASYNC_OPTIONS_TYPE,
  MODULE_OPTIONS_TOKEN: MONGO_MODULE_OPTIONS,
} = new ConfigurableModuleBuilder<MongoModuleOptions>().build();

const { ConfigurableModuleClass: MongooseModuleConfigurableModuleClass } =
  new ConfigurableModuleBuilder().build();

export class DynamicMongooseModule extends MongooseModuleConfigurableModuleClass {}

@Module({})
export class MongoModule extends ConfigurableModuleClass {
  private static readonly logger = new Logger(MongoModule.name);

  static registerAsync(
    options: typeof ASYNC_OPTIONS_TYPE & CommonDynamicModuleOptions,
  ): DynamicModule {
    const module = super.registerAsync(options);

    module.imports ??= [];
    module.imports.push(
      DynamicMongooseModule.registerAsync({
        useFactory: (mongoModuleOptions: MongoModuleOptions) => {
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

          module.imports!.push(
            MongooseModule.forRoot(uri.href, {
              user: connectionConfigs.username,
              pass: connectionConfigs.password,
              tlsCAFile: connectionConfigs.tlsCaFile,
              tls: connectionConfigs.isTlsEnabled ?? false,
              connectionName: options.connectionName,
            }),
          );
        },
        inject: [MONGO_MODULE_OPTIONS],
        provideInjectionTokensFrom: module.providers,
      }),
    );

    return module;
  }
}
