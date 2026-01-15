import { Injectable } from '@nestjs/common';
import { RabbitmqService } from '../modules';
import { MessageDto } from './dto';

@Injectable()
export class AppService {
  constructor(private readonly rabbitMQService: RabbitmqService) {}

  async publishMessage(messageDto: MessageDto) {
    await this.rabbitMQService.publishMessage(messageDto);
    return {
      success: true,
      message: 'Message published successfully',
    };
  }

  async getQueueMessageCount() {
    return this.rabbitMQService.getQueueMessageCount();
  }
}
