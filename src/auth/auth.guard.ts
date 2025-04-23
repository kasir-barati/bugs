import { CanActivate, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_SERVICE } from './auth.constant';
import { IAuthService } from './auth.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTH_SERVICE) private readonly authService: IAuthService,
  ) {}

  canActivate() {
    this.authService.test();
    console.log();
    console.log(this.reflector);

    return true;
  }
}
