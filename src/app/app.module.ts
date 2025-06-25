import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestModule } from '../test/test.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TestModuleConfig } from './configs/test-module.config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TestModule.forRootAsync({
      isGlobal: true,
      inject: [ConfigService],
      useClass: TestModuleConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
