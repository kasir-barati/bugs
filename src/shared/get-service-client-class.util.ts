import { GrpcObject, ServiceClientConstructor } from '@grpc/grpc-js';

export const getServiceClientClass = (
  proto: GrpcObject,
  serviceName: string,
  packagePath = 'some.pkg',
): ServiceClientConstructor => {
  let servicePackage = proto;

  for (const key of packagePath.split('.')) {
    servicePackage = servicePackage[key] as any;
  }

  return servicePackage[serviceName] as ServiceClientConstructor;
};
