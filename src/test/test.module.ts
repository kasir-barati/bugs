import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  TestModuleAsyncOptions,
  TestModuleOptionsFactory,
} from './test.interface';
import { TestService } from './test.service';
import { TEST_MODULE_OPTIONS } from './test.constant';

@Module({})
export class TestModule {
  static forRootAsync(options: TestModuleAsyncOptions): DynamicModule {
    return {
      module: TestModule,
      global: options.isGlobal ?? false,
      imports: [...(Array.isArray(options.imports) ? options.imports : [])],
      providers: [TestService, ...this.createAsyncProviders(options)],
      exports: [TestService],
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
      useFactory: async (optionsFactory: TestModuleOptionsFactory) =>
        await optionsFactory.createTestModuleOptions(),
      inject: [options.useExisting! || options.useClass],
    };
  }
}
