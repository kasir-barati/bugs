import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Request, Response } from 'express';

@Catch(RpcException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const err = exception.getError() as Record<string, unknown>;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const message = 'details' in err ? err.details : 'Default message';
    const code = 'code' in err ? err.code : 400;

    response.json({
      message,
      code,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
