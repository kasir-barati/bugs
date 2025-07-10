import {
  ChannelCredentials,
  ChannelOptions,
  Metadata,
  ServiceClientConstructor,
} from '@grpc/grpc-js';
import { Observable } from 'rxjs';

export function createGrpcClient<TServiceClient>(
  ServiceClient: ServiceClientConstructor,
  endpoint: string,
  useInsecureChannel = false,
): TServiceClient {
  const credentials = useInsecureChannel
    ? ChannelCredentials.createInsecure()
    : ChannelCredentials.createSsl();
  const options: Partial<ChannelOptions> = {
    'grpc.keepalive_time_ms': 10000,
    'grpc.keepalive_timeout_ms': 5000,
    'grpc.keepalive_permit_without_calls': 1,
  };
  const client = new ServiceClient(endpoint, credentials, options);
  const serviceMethods: Record<string, any> =
    Object.getPrototypeOf(client).constructor.service;

  for (const method of Object.keys(serviceMethods)) {
    const methodDescriptor = serviceMethods[method];
    const methodName = methodDescriptor.originalName;
    const originalMethod = client[methodName].bind(client);

    client[methodName] = (...args: unknown[]) => {
      const isClientStreaming = methodDescriptor.requestStream;
      const isServerStreaming = methodDescriptor.responseStream;

      if (isClientStreaming || isServerStreaming) {
        const call = originalMethod(...args);

        return new Observable((observer) => {
          call.on('data', (data: any) => observer.next(data));
          call.on('end', () => observer.complete());
          call.on('error', (error: any) => observer.error(error));
        });
      }

      return new Observable((observer) => {
        const callback = (error: any, response: any) => {
          if (error) {
            observer.error(error);
            return;
          }

          observer.next(response);
          observer.complete();
        };
        originalMethod(...args, callback);
      });
    };
  }

  return client as TServiceClient;
}

export function tokenHeaderToGrpcMetadata(header: any): Metadata {
  const metadata = new Metadata();

  if (header.authorization) {
    metadata.add('authorization', header.authorization);
  } else if (header.cookie) {
    metadata.add('cookie', header.cookie);
  }

  return metadata;
}

export function prepareRequest<TGrpcClient>(
  endpoint: string,
  header: any,
  serviceClientConstructor: ServiceClientConstructor,
) {
  console.log('22222222222');
  const serviceClient = createGrpcClient<TGrpcClient>(
    serviceClientConstructor,
    endpoint,
  );
  console.log('33333333333');
  const metadata = tokenHeaderToGrpcMetadata(header);
  console.log('44444444444');

  return { serviceClient, metadata };
}
