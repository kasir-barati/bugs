import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  MicroserviceOptions,
  Transport,
} from '@nestjs/microservices';
import { join } from 'path';
import { CALC_PACKAGE_NAME } from './proto/interfaces/calc.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:3000`,
      package: CALC_PACKAGE_NAME,
      protoPath: [join(__dirname, 'proto', 'calc.proto')],
      loader: {
        includeDirs: [join(__dirname, 'proto')],
      },
      keepalive: {
        keepaliveTimeMs: 120000,
        keepaliveTimeoutMs: 20000,
        keepalivePermitWithoutCalls: 1,
      },
    },
  });

  await app.startAllMicroservices();
}

bootstrap();
