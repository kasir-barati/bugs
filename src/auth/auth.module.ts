import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AUTH_OPTIONS, AUTH_SERVICE } from './auth.constant';
import { AsyncOptions, Options, OptionsFactory } from './auth.interface';

@Module({})
export class AuthModule {
  static forRoot(options?: Options): DynamicModule {
    return {
      module: AuthModule,
      providers: [
        {
          provide: AUTH_SERVICE,
          useClass: AuthService,
        },
        ...(Array.isArray(options?.providers) ? options.providers : []),
      ],
      exports: [AUTH_SERVICE],
    };
  }

  static forRootAsync(options?: AsyncOptions): DynamicModule {
    return {
      module: AuthModule,
      imports: Array.isArray(options?.imports) ? options.imports : [],
      providers: [
        { provide: AUTH_SERVICE, useClass: AuthService },
        ...this.createAsyncProvider(options),
      ],
      exports: [AUTH_SERVICE],
    };
  }

  private static createAsyncProvider(options?: AsyncOptions): Provider[] {
    if (!options) {
      return [];
    }

    if (options?.useExisting || options?.useFactory) {
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

  private static createAsyncOptionsProvider(options: AsyncOptions): Provider {
    if (options.useFactory) {
      return {
        provide: AUTH_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    return {
      provide: AUTH_OPTIONS,
      useFactory: async (optionsFactory: OptionsFactory) =>
        await optionsFactory.createOptions(),
      inject: [options.useExisting! || options.useClass],
    };
  }
}
