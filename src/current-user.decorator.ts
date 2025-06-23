import { createParamDecorator, Logger } from '@nestjs/common';
import { CustomParamFactory } from '@nestjs/common/interfaces';
import { CommonContextType, User } from './app.type';
import { Request } from 'express';

const logger = new Logger('CurrentUser');

const currentUserFactory: CustomParamFactory<unknown, User> = (
  _data,
  context,
) => {
  switch (context.getType<CommonContextType>()) {
    case 'rpc': {
      const request: Request = context.switchToRpc().getContext();

      return request.user;
    }
    case 'http': {
      const request = context.switchToHttp().getRequest<Request>();

      return request.user;
    }
    default:
      logger.error(
        `CurrentUserContext decorator has not been implemented fot type ${context.getType()}`,
      );

      throw new Error('Request type has is not implemented');
  }
};

export const CurrentUser = createParamDecorator(currentUserFactory);
