import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Request } from 'express';
import { CommonContextType } from './app.type';

@Injectable()
export class AuthGuard implements CanActivate {
  private readonly logger = new Logger(AuthGuard.name);

  canActivate(context: ExecutionContext) {
    switch (context.getType<CommonContextType>()) {
      case 'rpc': {
        const request: Request = context.switchToRpc().getContext();

        request.user = { id: randomUUID() };
        break;
      }
      case 'http': {
        const request = context.switchToHttp().getRequest<Request>();

        request.user = { id: randomUUID() };
        break;
      }
      default:
        this.logger.error(
          `CurrentUserContext decorator has not been implemented fot type ${context.getType()}`,
        );

        throw new Error('Request type has is not implemented');
    }

    return true;
  }
}
