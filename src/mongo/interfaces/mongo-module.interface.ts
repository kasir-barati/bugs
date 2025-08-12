export interface MongoModuleOptions {
  serviceName: string;
  connectionConfigs: {
    /** @description the default value is false */
    isTlsEnabled?: boolean;
    alternativeDatabaseName?: string;
    tlsCaFile?: string;
    uri: string;
    password?: string;
    username?: string;
    authMechanism?: string;
  };
}

export interface CommonDynamicModuleOptions {
  connectionName?: string;
  global?: boolean;
}
