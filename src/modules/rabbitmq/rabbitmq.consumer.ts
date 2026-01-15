import { Injectable, Logger } from '@nestjs/common';
import {
  AmqpConnection,
  RabbitSubscribe,
} from '@golevelup/nestjs-rabbitmq';
import { MessageDto } from '../../app';
import {
  RABBITMQ_EXCHANGE,
  RABBITMQ_QUEUE,
  RABBITMQ_ROUTING_KEY,
} from './rabbitmq.constants';

@Injectable()
export class RabbitmqConsumer {
  private readonly logger = new Logger(RabbitmqConsumer.name);

  constructor(private readonly amqpConnection: AmqpConnection) {}

  @RabbitSubscribe({
    exchange: RABBITMQ_EXCHANGE,
    routingKey: RABBITMQ_ROUTING_KEY,
    queue: RABBITMQ_QUEUE,
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
  async handleMessages(messages: MessageDto[]) {
    this.logger.log('=== Received Message ===');

    // Parallel processing of messages
    await Promise.allSettled(
      messages.map((message) => {
        return this.handleMessage(message);
      }),
    );

    this.logger.log('========================');
  }

  async handleMessage(message: MessageDto) {
    try {
      this.logger.log(JSON.stringify(message, null, 2));

      // README: Just for testing!
      if (
        message.value?.userId === 0 ||
        message.value?.userId === 27 ||
        message.value?.userId === 57
      ) {
        this.logger.error('Simulated processing error');
        throw new Error('Simulated processing error');
      }

      // README: Just for testing!
      await sleep(Math.floor(Math.random() * 2) + 1); // Sleep for 1 to 2 minutes
    } catch (error) {
      // README: Just for testing!
      const modifiedMessage = {
        ...message,
        value: {
          ...message.value,
          userId: message.value?.userId + 1,
        },
      };

      this.amqpConnection
        .publish(
          RABBITMQ_EXCHANGE,
          RABBITMQ_ROUTING_KEY,
          modifiedMessage,
        )
        .catch((error) => {
          this.logger.error(
            `Failed to requeue ${JSON.stringify(modifiedMessage)}: ${error.message}`,
          );
        });
    }
  }
}

function sleep(minutes: number) {
  const milliseconds = minutes * 60 * 1000;
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
