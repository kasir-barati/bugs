import * as ProtoLoader from '@grpc/proto-loader';
import { join } from 'path';
import {
  ChannelCredentials,
  Client,
  credentials,
  loadPackageDefinition,
} from '@grpc/grpc-js';
import {
  SumReq,
  SumRes,
} from '../src/proto/interfaces/calc.interface';
import { ClientDuplexStreamImpl } from '@grpc/grpc-js/build/src/call';

interface CalcService {
  new (
    url: string,
    credentials: ChannelCredentials,
  ): Client & { sum: () => ClientDuplexStreamImpl<SumReq, SumRes> };
}

const calcProtobufFilePath = join(
  __dirname,
  '..',
  'src',
  'proto',
  'calc.proto',
);

describe('AppController (e2e)', () => {
  let client: Client & {
    sum: (...args: any) => ClientDuplexStreamImpl<SumReq, SumRes>;
  };

  beforeAll(() => {
    const proto = ProtoLoader.loadSync(calcProtobufFilePath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const {
      calc: { CalcService },
    } = loadPackageDefinition(proto) as unknown as {
      calc: {
        CalcService: CalcService;
      };
    };

    client = new CalcService(
      'localhost:3000',
      credentials.createInsecure(),
    );
  });

  it('should return 4 and close the stream', (done) => {
    // Arrange
    const callHandler = client.sum();
    let result = 0;
    callHandler.on('error', (err) => {
      if (err) {
        console.log("callHandler.on('error', (err) => {...})");
        console.log(err);
        throw err;
      }
    });
    callHandler.on('data', (res: SumRes) => {
      console.log('result right now is ' + result);
      result = res.result;
    });

    // Act
    callHandler.write({ number: 1 }, 'utf-8');
    callHandler.write({ number: 1 }, 'utf-8');
    callHandler.write({ number: 1 }, 'utf-8');

    // Assert
    setTimeout(() => {
      callHandler.end();
      client.close();
      expect(result).toBe(4);
      callHandler.removeAllListeners();
      done();
    }, 1000);
  });
});
