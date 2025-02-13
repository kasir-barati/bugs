import * as ProtoLoader from '@grpc/proto-loader';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import {
  ChannelCredentials,
  credentials,
  loadPackageDefinition,
  Metadata,
} from '@grpc/grpc-js';
import {
  CALC_PACKAGE_NAME,
  SumReq,
  SumRes,
} from '../src/proto/interfaces/calc.interface';
import { ClientDuplexStreamImpl } from '@grpc/grpc-js/build/src/call';
import { CalcModule } from '../src/calc/calc.module';

interface CalcService {
  new (
    url: string,
    credentials: ChannelCredentials,
  ): { sum: () => ClientDuplexStreamImpl<SumReq, SumRes> };
}

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let client: { sum: (...args: any) => ClientDuplexStreamImpl<SumReq, SumRes> };
  const calcProtobufFilePath = join(
    __dirname,
    '..',
    'src',
    'proto',
    'calc.proto',
  );

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [CalcModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: 'localhost:3000',
        package: [CALC_PACKAGE_NAME],
        protoPath: [calcProtobufFilePath],
      },
    });

    await app.startAllMicroservices();
    await app.init();

    const proto = ProtoLoader.loadSync(calcProtobufFilePath);
    const protoGRPC = loadPackageDefinition(proto) as unknown as {
      calc: {
        CalcService: CalcService;
      };
    };

    client = new protoGRPC.calc.CalcService(
      'localhost:3000',
      credentials.createInsecure(),
    );
  });

  it('test class-validator', (done) => {
    const metadata = new Metadata();

    // Arrange
    const callHandler = client.sum(metadata);
    callHandler.on('error', (err) => {
      console.log("callHandler.on('error', (err) => {...})");
      console.log(err);
      throw err;
    });

    // Act
    callHandler.write({ number: 1 }, 'utf-8', console.error);

    // Assert
    callHandler.on('data', (res: SumRes) => {
      callHandler.end();
      expect(res.result).toBe(2);
      done();
    });
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });
});
