import { Injectable } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq/rabbitmq.service';
import { MessageDto } from './dto/message.dto';

@Injectable()
export class AppService {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

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
