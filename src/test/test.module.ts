import { DynamicModule, Module, Provider } from '@nestjs/common';

import {
  TEST_GRPC_CLIENT,
  TEST_MODULE_OPTIONS,
  TEST_SERVICE,
} from './constants';
import {
  CommonOptionsForDynamicModules,
  TestModuleAsyncOptions,
  TestModuleAsyncOptionsFactory,
  TestModuleOptions,
} from './interfaces';
import { TestService } from './test.service';

@Module({})
export class TestModule {
  static forRoot(
    options: TestModuleOptions & CommonOptionsForDynamicModules,
  ): DynamicModule {
    return {
      module: TestModule,
      global: options?.global ?? false,
      providers: [
        {
          provide: TEST_MODULE_OPTIONS,
          useValue: options,
        },
        {
          provide: TEST_SERVICE,
          useClass: options?.TestService ?? TestService,
        },
        {
          provide: TEST_GRPC_CLIENT,
          useClass: options.TestServiceGrpcClient,
        },
      ],
      exports: [TEST_SERVICE],
    };
  }

  static forRootAsync(options: TestModuleAsyncOptions): DynamicModule {
    return {
      module: TestModule,
      global: options?.global ?? false,
      providers: [
        {
          provide: TEST_SERVICE,
          useClass: options?.TestService ?? TestService,
        },
        {
          provide: TEST_GRPC_CLIENT,
          useClass: options.TestServiceGrpcClient,
        },
        ...this.createAsyncProviders(options),
      ],
      imports: [...(Array.isArray(options.imports) ? options.imports : [])],
      exports: [TEST_SERVICE],
    };
  }

  private static createAsyncProviders(
    options: TestModuleAsyncOptions,
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
    options: TestModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TEST_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: TEST_MODULE_OPTIONS,
      useFactory: async (optionsFactory: TestModuleAsyncOptionsFactory) =>
        await optionsFactory.createTestModuleOptions(),
      inject: [options.useExisting! || options.useClass],
    };
  }
}
