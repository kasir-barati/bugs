import * as ProtoLoader from '@grpc/proto-loader';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { UserModule } from '../src/user/user.module';
import { BullModule } from '@nestjs/bullmq';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { HeroesServiceClient } from '../src/proto/interfaces/test.interface';
import {
  ChannelCredentials,
  credentials,
  loadPackageDefinition,
  Metadata,
} from '@grpc/grpc-js';

interface HeroesService {
  new (url: string, credentials: ChannelCredentials): HeroesServiceClient;
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let client: HeroesServiceClient;
  const testProtobufFilePath = join(
    __dirname,
    '..',
    'src',
    'proto',
    'test.proto',
  );
  let container: StartedRedisContainer;

  beforeEach(async () => {
    container = await new RedisContainer('redis:alpine')
      .withExposedPorts({ host: 6379, container: 6379 })
      .start();
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.forRoot({
          connection: { url: container.getConnectionUrl() },
        }),
        UserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: 'localhost:3000',
        package: ['hero'],
        protoPath: [testProtobufFilePath],
      },
    });

    await app.startAllMicroservices();
    await app.init();

    const proto = ProtoLoader.loadSync(testProtobufFilePath);
    const protoGRPC = loadPackageDefinition(proto) as unknown as {
      hero: {
        HeroesService: HeroesService;
      };
    };

    client = new protoGRPC.hero.HeroesService(
      'localhost:3000',
      credentials.createInsecure(),
    );
  });

  it('test class-validator', (done) => {
    const metadata = new Metadata();
    client.findOne({ id: '23123' }, metadata, (err: any, response: any) => {
      if (err) {
        console.error(err);
        done(err);
      }

      console.log(response);

      done();
    });
  });

  afterEach(async () => {
    await container.stop();
    process.exit();
  });
});
