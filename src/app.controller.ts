import { Controller, Get, Inject, UseGuards } from '@nestjs/common';
import { IAuthService } from './auth/auth.interface';
import { AUTH_SERVICE } from './auth/auth.constant';
import { AuthGuard } from './auth/auth.guard';

@UseGuards(AuthGuard)
@Controller()
export class AppController {
  constructor(
    @Inject(AUTH_SERVICE)
    private readonly authService: IAuthService,
  ) {}

  @Get()
  getHello(): string {
    this.authService.test();

    return 'Hello';
  }
}
