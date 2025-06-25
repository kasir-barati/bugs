import { Injectable } from '@nestjs/common';
import {
  TestModuleOptions,
  TestModuleOptionsFactory,
} from '../../test/test.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestModuleConfig implements TestModuleOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTestModuleOptions(): Promise<TestModuleOptions> | TestModuleOptions {
    return {
      someOption: this.configService.getOrThrow('SOME_OPTION'),
    };
  }
}
