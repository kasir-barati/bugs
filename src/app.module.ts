import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CorrelationIdModule } from 'nestjs-backend-common';
import { ClsModule } from 'nestjs-cls';

@Module({
  imports: [
    CorrelationIdModule.forRoot({ isGlobal: true }),
    ClsModule.forRoot({
      global: true,
      guard: { mount: true },
      middleware: { mount: true },
      interceptor: { mount: true },
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
