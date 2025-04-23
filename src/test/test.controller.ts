import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('test')
export class TestController {
  @Get()
  getTest(): string {
    return 'Test';
  }
}
