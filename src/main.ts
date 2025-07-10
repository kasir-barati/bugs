import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { SOME_PKG_TEST_SERVICE_PACKAGE_NAME } from './assets/interfaces/test.interface';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: `0.0.0.0:5000`,
      package: SOME_PKG_TEST_SERVICE_PACKAGE_NAME,
      protoPath: [join(__dirname, 'assets', 'test.proto')],
      loader: {
        includeDirs: [join(__dirname, 'assets')],
      },
      keepalive: {
        keepaliveTimeMs: 120000,
        keepaliveTimeoutMs: 20000,
        keepalivePermitWithoutCalls: 1,
      },
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
