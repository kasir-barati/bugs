import { Inject, Injectable } from '@nestjs/common';
import { TEST_MODULE_OPTIONS } from './test.constant';
import { TestModuleOptions } from './test.interface';

@Injectable()
export class TestService {
  constructor(
    @Inject(TEST_MODULE_OPTIONS) private readonly options: TestModuleOptions,
  ) {}
}
