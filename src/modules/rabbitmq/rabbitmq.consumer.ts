import { Injectable, Logger } from '@nestjs/common';
import { RabbitSubscribe } from '@golevelup/nestjs-rabbitmq';
import { MessageDto } from '../../app/dto/message.dto';

@Injectable()
export class RabbitmqConsumer {
  private readonly logger = new Logger(RabbitmqConsumer.name);

  @RabbitSubscribe({
    exchange: process.env.RABBITMQ_EXCHANGE || 'batch-exchange',
    routingKey: process.env.RABBITMQ_ROUTING_KEY || 'batch.process',
    queue: process.env.RABBITMQ_QUEUE || 'batch-processing-queue',
    queueOptions: {
      durable: true,
    },
    batchOptions: {
      size: 10,
    },
    errorHandler: (channel, message) => {
      const humanReadableMessage: MessageDto = JSON.parse(
        message.content.toString(),
      );
      const logger = new Logger(RabbitmqConsumer.name);
      logger.error(
        `Error processing ${JSON.stringify(
          humanReadableMessage,
        )} on ${message.fields.exchange} with ${message.fields.routingKey} as it routing key`,
      );
      channel.nack(message, undefined, false);
    },
  })
  async handleMessage(message: MessageDto[]) {
    this.logger.log('=== Received Message ===');
    this.logger.log(JSON.stringify(message, null, 2));
    this.logger.log('========================');

    if (
      message.find(
        ({ value }) =>
          value?.userId === 7 ||
          value?.userId === 27 ||
          value?.userId === 57,
      )
    ) {
      this.logger.error('Simulated processing error');
      throw new Error('Simulated processing error');
    }

    await sleep(Math.floor(Math.random() * 5) + 1); // Sleep for 1 to 5 minutes

    return; // Acknowledge the message
  }
}

function sleep(minutes: number) {
  const milliseconds = minutes * 60 * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
