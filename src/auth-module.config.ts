import { ConfigService } from '@nestjs/config';
import { AUTH_SERVICE } from './auth/auth.constant';
import { Options, OptionsFactory } from './auth/auth.interface';
import { ExtendedAuthService } from './extended-auth.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthModuleConfigs implements OptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createOptions(): Promise<Options> | Options {
    console.log(this.configService.get('NODE_ENV'));

    return {
      providers: [{ provide: AUTH_SERVICE, useClass: ExtendedAuthService }],
    };
  }
}
