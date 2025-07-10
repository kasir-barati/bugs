import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestModule } from '../test';
import { AppService } from './app.service';
import {
  getTestServiceGrpcClient,
  TestModuleConfig,
} from './configs/test-module.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }),
    TestModule.forRootAsync({
      useClass: TestModuleConfig,
      inject: [ConfigService],
      TestServiceGrpcClient: getTestServiceGrpcClient(),
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
