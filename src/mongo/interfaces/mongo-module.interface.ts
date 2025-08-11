import { DynamicModule, ModuleMetadata, Type } from '@nestjs/common';

export interface RegisterMongoModuleOptions
  extends Pick<DynamicModule, 'global'>,
    MongoModuleOptions {
  connectionName?: string;
}

export interface MongoModuleOptions {
  serviceName: string;
  connectionConfigs: {
    /** @description the default value is false */
    isTlsEnabled?: boolean;
    alternativeDatabaseName?: string;
    tlsCaFile?: string;
    uri: string;
    password?: string;
    username?: string;
    authMechanism?: string;
  };
}

export interface MongoModuleAsyncOptionsFactory {
  createMongoModuleOptions(): Promise<MongoModuleOptions> | MongoModuleOptions;
}

export interface MongoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>,
    Pick<DynamicModule, 'global'> {
  useExisting?: Type<MongoModuleAsyncOptionsFactory>;
  useClass?: Type<MongoModuleAsyncOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<MongoModuleOptions> | MongoModuleOptions;
  inject?: any[];
  connectionName?: string;
}
