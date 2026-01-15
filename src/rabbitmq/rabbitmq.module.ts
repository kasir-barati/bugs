import { Module } from '@nestjs/common';
import { RabbitMQModule as GolevelupRabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumer } from './rabbitmq.consumer';

@Module({
  imports: [
    GolevelupRabbitMQModule.forRoot({
      exchanges: [
        {
          name: process.env.RABBITMQ_EXCHANGE || 'batch-exchange',
          type: 'topic',
          options: {
            durable: true,
          },
        },
      ],
      uri:
        process.env.RABBITMQ_URL ||
        'amqp://guest:guest@rabbitmq:5672',
      connectionInitOptions: { wait: false, timeout: 30000 },
      enableControllerDiscovery: true,
    }),
  ],
  providers: [RabbitMQService, RabbitMQConsumer],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
