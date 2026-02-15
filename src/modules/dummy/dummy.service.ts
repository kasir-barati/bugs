import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DummyService {
  constructor(private readonly amqpConnection: AmqpConnection) {}

  tempMethod() {
    return 'temp';
  }
}
