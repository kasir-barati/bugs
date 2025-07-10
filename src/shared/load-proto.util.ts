import {
  GrpcObject,
  loadPackageDefinition,
  ServiceClientConstructor,
} from '@grpc/grpc-js';
import { loadSync } from '@grpc/proto-loader';

export const loadProto = ({
  includeDirs,
  protoFilePath,
  commonProtoFiles = [],
}: {
  includeDirs: string[];
  protoFilePath: string;
  commonProtoFiles?: string[];
}): GrpcObject => {
  const packageDefinition = loadSync([...commonProtoFiles, protoFilePath], {
    keepCase: false,
    includeDirs,
  });

  return loadPackageDefinition(packageDefinition);
};

export const createServiceClientConstructor = (
  proto: GrpcObject,
  serviceName: string,
  packagePath = 'grpc.energy_robotics',
): ServiceClientConstructor => {
  let servicePackage = proto;

  for (const key of packagePath.split('.')) {
    servicePackage = servicePackage[key] as unknown as GrpcObject;
  }

  return servicePackage[serviceName] as ServiceClientConstructor;
};
