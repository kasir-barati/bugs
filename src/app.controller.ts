import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomLoggerService } from 'nestjs-backend-common';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly logger: CustomLoggerService,
  ) {}

  @Get()
  getHello(): string {
    this.logger.log('My lovely controller!', {
      context: AppController.name,
      correlationId: '123',
    });

    return this.appService.getHello();
  }
}
