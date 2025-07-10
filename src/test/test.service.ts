import { ServiceClientConstructor } from '@grpc/grpc-js';
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { TEST_GRPC_CLIENT, TEST_MODULE_OPTIONS } from './constants';
import { ITestService, TestModuleOptions } from './interfaces';

@Injectable()
export class TestService
  implements ITestService, OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(TEST_MODULE_OPTIONS)
    private readonly options: TestModuleOptions,
    @Inject(TEST_GRPC_CLIENT)
    private readonly serviceClientConstructor: ServiceClientConstructor,
  ) {}

  someMethod() {
    return true;
  }

  onModuleInit() {
    console.log('init...');
    console.log(this.options);
    console.log(this.serviceClientConstructor);
  }

  onModuleDestroy() {
    console.log('destroy...');
  }
}
