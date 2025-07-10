import { ServiceClientConstructor } from '@grpc/grpc-js';
import { ModuleMetadata, Type } from '@nestjs/common';

export interface Class<T> {
  new (...args: any[]): T;
}

export interface CommonOptionsForDynamicModules {
  global?: boolean;
}

interface SharedOptions {
  TestService?: Class<ITestService>;
  TestServiceGrpcClient: ServiceClientConstructor;
}

export interface TestModuleOptions extends SharedOptions {
  testServiceGrpcUri: string;
  refreshIntervalMs: number;
}

export type CreateTestAsyncOptions = Omit<
  TestModuleOptions,
  'TestService' | 'TestServiceGrpcClient'
>;

export interface TestModuleAsyncOptionsFactory {
  createTestModuleOptions():
    | Promise<CreateTestAsyncOptions>
    | CreateTestAsyncOptions;
}

export interface TestModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>,
    CommonOptionsForDynamicModules,
    SharedOptions {
  useExisting?: Type<TestModuleAsyncOptionsFactory>;
  useClass?: Type<TestModuleAsyncOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<CreateTestAsyncOptions> | CreateTestAsyncOptions;
  inject?: any[];
}

export interface ITestService {
  someMethod: () => boolean;
}
