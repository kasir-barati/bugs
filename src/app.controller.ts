import { Controller, Get } from '@nestjs/common';
import { CORRELATION_ID_CLS_KEY } from 'nestjs-backend-common';
import { ClsService } from 'nestjs-cls';

@Controller()
export class AppController {
  constructor(private readonly clsService: ClsService) {}

  @Get()
  getHello(): string {
    console.log('*'.repeat(10));

    return this.clsService.get(CORRELATION_ID_CLS_KEY);
  }
}
