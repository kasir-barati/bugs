import { loadSync } from '@grpc/proto-loader';
import { credentials, loadPackageDefinition, Metadata } from '@grpc/grpc-js';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ClientDuplexStreamImpl } from '@grpc/grpc-js/build/src/call';
import { Chunk, UploadResponse } from '../src/file-upload.interface';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let client: {
    upload: (
      metadata: Metadata,
    ) => ClientDuplexStreamImpl<Chunk, UploadResponse>;
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const protoFilePath = join(__dirname, '..', 'src', 'file-upload.proto');

    app = moduleFixture.createNestApplication();

    app.connectMicroservice<MicroserviceOptions>({
      transport: Transport.GRPC,
      options: {
        url: 'localhost:61111',
        package: ['File'],
        loader: {
          includeDirs: [],
        },
        protoPath: [protoFilePath],
        keepalive: {
          keepaliveTimeMs: 120000,
          keepaliveTimeoutMs: 20000,
          keepalivePermitWithoutCalls: 1,
        },
      },
    });

    await app.startAllMicroservices();
    await app.init();

    const proto = loadSync(protoFilePath, {
      includeDirs: [],
    });

    const protoGRPC: any = loadPackageDefinition(proto);

    client = new protoGRPC.File.FileUploadService(
      'localhost:61111',
      credentials.createInsecure(),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('should upload the file', async () => {
    // Arrange
    const metadata = new Metadata();
    const duplexStream = client.upload(metadata);

    // Act
    await new Promise((resolve, reject) => {
      duplexStream
        .on('data', (data) => {
          console.log(
            'E2E test file -- we received data: ' + JSON.stringify(data),
          );
        })
        .on('end', resolve)
        .on('error', reject);
      duplexStream.write({
        data: new Uint8Array(),
        filename: 'some.txt',
      } as Chunk);
      duplexStream.end();
    });

    // Assert
    expect(true).toBeTruthy();
  });
});
