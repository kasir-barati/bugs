import { Module, LogLevel } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule, LogMode } from 'nestjs-backend-common';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    LoggerModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        logMode: configService.get<LogMode>('LOG_MODE', 'PLAIN_TEXT'),
        logLevel: configService.get<LogLevel>('LOG_LEVEL', 'verbose'),
      }),
    }),
    LoggerModule.register({
      global: true,
      logMode: 'PLAIN_TEXT',
      logLevel: 'verbose',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
