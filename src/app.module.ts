import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { AuthModuleConfigs } from './auth-module.config';
import { ConfigModule } from '@nestjs/config';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    AuthModule.forRootAsync({
      imports: [ConfigModule],
      useClass: AuthModuleConfigs,
    }),
    TestModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
