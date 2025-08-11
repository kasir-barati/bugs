import { DynamicModule, Logger, Module, Provider } from '@nestjs/common';
import {
  getConnectionToken,
  MongooseModule,
  MongooseModuleFactoryOptions,
} from '@nestjs/mongoose';
import { Connection } from 'mongoose';

import { MONGO_MODULE_OPTIONS } from './constants';
import {
  MongoModuleAsyncOptions,
  MongoModuleAsyncOptionsFactory,
  MongoModuleOptions,
} from './interfaces';
import { IndexService } from './services/index.service';

@Module({})
export class MongoModule {
  private static readonly logger = new Logger(MongoModule.name);

  static registerAsync(options: MongoModuleAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: MongoModule,
      imports: [
        ...(options.imports ?? []),
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
      ],
      providers: [
        ...asyncProviders,
        {
          provide: Symbol('CreateIndexOnBootstrapService'),
          useFactory(connection: Connection) {
            return new IndexService(connection);
          },
          inject: [getConnectionToken(options.connectionName)],
        },
      ],
      exports: [MONGO_MODULE_OPTIONS],
    };
  }

  private static createAsyncProviders(
    options: MongoModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }

    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: options.useClass!,
        useClass: options.useClass!,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: MongoModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: MONGO_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    return {
      provide: MONGO_MODULE_OPTIONS,
      useFactory: async (optionsFactory: MongoModuleAsyncOptionsFactory) =>
        await optionsFactory.createMongoModuleOptions(),
      inject: [options.useExisting! || options.useClass],
    };
  }
}
