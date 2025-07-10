import { ServiceClientConstructor } from '@grpc/grpc-js';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';

import {
  SOME_PKG_TEST_SERVICE_PACKAGE_NAME,
  TEST_SERVICE_NAME,
} from '../../assets/interfaces/test.interface';
import { getServiceClientClass, loadProto } from '../../shared';
import {
  CreateTestAsyncOptions,
  TestModuleAsyncOptionsFactory,
} from '../../test';

@Injectable()
export class TestModuleConfig implements TestModuleAsyncOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTestModuleOptions():
    | Promise<CreateTestAsyncOptions>
    | CreateTestAsyncOptions {
    const refreshIntervalMs = Number(
      this.configService.get('REFRESH_INTERVAL_MS') ?? 60 * 1000,
    );
    const testServiceGrpcUri = this.configService.getOrThrow(
      'TEST_SERVICE_GRPC_ENDPOINT',
    );

    return {
      refreshIntervalMs,
      testServiceGrpcUri,
    };
  }
}

export function getTestServiceGrpcClient(): ServiceClientConstructor {
  const proto = loadProto({
    includeDirs: [],
    protoFilePath: join(process.cwd(), 'src', 'assets', 'test.proto'),
  });
  return getServiceClientClass(
    proto,
    TEST_SERVICE_NAME,
    SOME_PKG_TEST_SERVICE_PACKAGE_NAME,
  );
}
