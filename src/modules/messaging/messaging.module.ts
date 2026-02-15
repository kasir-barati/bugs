import { Global, Module } from "@nestjs/common";
import { RabbitMQModule } from "@golevelup/nestjs-rabbitmq";
import { ConfigService } from "@nestjs/config";

@Global()
@Module({
  imports: [
    RabbitMQModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow("RABBITMQ_URI"),
        exchanges: [
          {
            name: "default-exchange",
            type: "topic",
          },
        ],
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [RabbitMQModule],
})
export class MessagingModule {}
