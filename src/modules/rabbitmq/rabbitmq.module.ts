import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitmqService } from './rabbitmq.service';
import { RabbitmqConsumer } from './rabbitmq.consumer';

@Module({
  imports: [
    RabbitMQModule.forRoot({
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
      prefetchCount: 10,
    }),
  ],
  providers: [RabbitmqService, RabbitmqConsumer],
  exports: [RabbitmqService],
})
export class RabbitmqModule {}
