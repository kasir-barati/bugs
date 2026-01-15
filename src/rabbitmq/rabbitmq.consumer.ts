import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageDto } from '../dto/message.dto';

@Injectable()
export class RabbitMQConsumer {
  private readonly logger = new Logger(RabbitMQConsumer.name);

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE || 'batch-exchange',
    routingKey: process.env.RABBITMQ_ROUTING_KEY || 'batch.process',
    queue: process.env.RABBITMQ_QUEUE || 'batch-processing-queue',
    queueOptions: {
      durable: true,
    },
  })
  async handleMessage(message: MessageDto) {
    this.logger.log('=== Received Message ===');
    this.logger.log(JSON.stringify(message, null, 2));
    this.logger.log('========================');

    // Process the message here
    // For now, we just log it

    await sleep(2);

    return; // Acknowledge the message
  }
}

function sleep(minutes: number) {
  const milliseconds = minutes * 60 * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
