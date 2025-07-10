import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';

import { TEST_MODULE_OPTIONS } from './constants';
import { ITestService, TestModuleOptions } from './interfaces';

@Injectable()
export class TestService
  implements ITestService, OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(TEST_MODULE_OPTIONS)
    private readonly options: TestModuleOptions,
  ) {}

  someMethod() {
    console.log(this.options.TestServiceGrpcClient);

    return true;
  }

  onModuleInit() {
    console.log('init...');
    console.log(this.options);
  }

  onModuleDestroy() {
    console.log('destroy...');
  }
}
