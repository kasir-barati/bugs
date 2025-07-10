import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { TestService } from '../test.service';

@Injectable()
export class TestGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly testService: TestService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    console.log('Do some magic with ', this.reflector);
    return this.testService.someMethod();
  }
}
