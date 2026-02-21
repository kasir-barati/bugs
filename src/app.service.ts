import { Injectable } from '@nestjs/common';
import { CustomLoggerService } from 'nestjs-backend-common';

@Injectable()
export class AppService {
  constructor(private readonly logger: CustomLoggerService) {}

  getHello(): string {
    // Example with context and correlationId (with intellisense!)
    this.logger.log('My lovely service!', {
      context: AppService.name,
      correlationId: '456',
    });

    // Example with extra parameters
    this.logger.log('Service with extra data', {
      context: AppService.name,
      correlationId: '789',
      userId: 'user-123',
      requestId: 'req-456',
      customField: { nested: 'value' },
    });

    return 'Hello World!';
  }
}
