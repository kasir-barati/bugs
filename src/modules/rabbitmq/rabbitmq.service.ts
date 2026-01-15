import { Injectable, Logger } from '@nestjs/common';
import { AmqpConnection } from '@golevelup/nestjs-rabbitmq';
import axios from 'axios';
import { MessageDto } from '../../app';
import {
  RABBITMQ_EXCHANGE,
  RABBITMQ_MANAGEMENT_URL,
  RABBITMQ_QUEUE,
  RABBITMQ_ROUTING_KEY,
} from './rabbitmq.constants';

@Injectable()
export class RabbitmqService {
  private readonly logger = new Logger(RabbitmqService.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  async publishMessage(message: MessageDto): Promise<void> {
    try {
      await this.amqpConnection.publish(
        RABBITMQ_EXCHANGE,
        RABBITMQ_ROUTING_KEY,
        message,
      );
      this.logger.log(
        `Message published to exchange: ${RABBITMQ_EXCHANGE}, routing key: ${RABBITMQ_ROUTING_KEY}`,
      );
    } catch (error) {
      this.logger.error('Failed to publish message', error);
      throw error;
    }
  }

  async getQueueMessageCount(): Promise<{
    queue: string;
    messageCount: number;
  }> {
    try {
      const response = await axios.get(
        `${RABBITMQ_MANAGEMENT_URL}/api/queues/%2F/${RABBITMQ_QUEUE}`,
        {
          auth: {
            username: 'guest',
            password: 'guest',
          },
        },
      );

      const messageCount = response.data.messages || 0;
      this.logger.log(
        `Queue ${RABBITMQ_QUEUE} has ${messageCount} messages`,
      );

      return {
        queue: RABBITMQ_QUEUE,
        messageCount,
      };
    } catch (error) {
      this.logger.error('Failed to get queue message count', error);
      throw error;
    }
  }
}
