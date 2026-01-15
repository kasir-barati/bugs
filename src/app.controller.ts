import {
  Controller,
  Post,
  Get,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { MessageDto } from './dto/message.dto';

@ApiTags('Batch Processing')
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('publish')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Publish a message to RabbitMQ queue' })
  @ApiResponse({
    status: 200,
    description: 'Message successfully published',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: {
          type: 'string',
          example: 'Message published successfully',
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid message format',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async publishMessage(@Body() messageDto: MessageDto) {
    return this.appService.publishMessage(messageDto);
  }

  @Get('queue/count')
  @ApiOperation({
    summary: 'Get the current message count in the queue',
  })
  @ApiResponse({
    status: 200,
    description: 'Queue message count retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        queue: { type: 'string', example: 'batch-processing-queue' },
        messageCount: { type: 'number', example: 5 },
      },
    },
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getQueueCount() {
    return this.appService.getQueueMessageCount();
  }
}
