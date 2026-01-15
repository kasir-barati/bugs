import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import { MessageDto } from '../dto/message.dto';
import axios from 'axios';

@Injectable()
export class RabbitMQService {
  private readonly logger = new Logger(RabbitMQService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishMessage(message: MessageDto): Promise<void> {
    const exchange = process.env.RABBITMQ_EXCHANGE || 'batch-exchange';
    const routingKey = process.env.RABBITMQ_ROUTING_KEY || 'batch.process';

    try {
      await this.amqpConnection.publish(exchange, routingKey, message);
      this.logger.log(`Message published to exchange: ${exchange}, routing key: ${routingKey}`);
    } catch (error) {
      this.logger.error('Failed to publish message', error);
      throw error;
    }
  }

  async getQueueMessageCount(): Promise<{ queue: string; messageCount: number }> {
    const queueName = process.env.RABBITMQ_QUEUE || 'batch-processing-queue';
    const managementUrl = process.env.RABBITMQ_MANAGEMENT_URL || 'http://rabbitmq:15672';
    
    try {
      const response = await axios.get(
        `${managementUrl}/api/queues/%2F/${queueName}`,
        {
          auth: {
            username: 'guest',
            password: 'guest',
          },
        },
      );

      const messageCount = response.data.messages || 0;
      this.logger.log(`Queue ${queueName} has ${messageCount} messages`);

      return {
        queue: queueName,
        messageCount,
      };
    } catch (error) {
      this.logger.error('Failed to get queue message count', error);
      throw error;
    }
  }
}
