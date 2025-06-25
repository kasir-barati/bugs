import { ModuleMetadata, Type } from '@nestjs/common';

interface CommonOptionsForDynamicModules {
  /** @default false */
  isGlobal: boolean;
}

export type TestModuleOptions = {
  someOption: string;
};

export interface TestModuleOptionsFactory {
  createTestModuleOptions(): Promise<TestModuleOptions> | TestModuleOptions;
}

export interface TestModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'>,
    CommonOptionsForDynamicModules {
  useExisting?: Type<TestModuleOptionsFactory>;
  useClass?: Type<TestModuleOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<TestModuleOptions> | TestModuleOptions;
  inject?: any[];
}
