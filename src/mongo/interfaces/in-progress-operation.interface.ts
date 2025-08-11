interface Command {
  /** @example 1 */
  currentOp: number;
  $or: [
    { 'command.createIndexes': null | string },
    { op: 'command'; 'command.createIndexes': null | string },
  ];
}
interface ClientMetadata {
  driver: {
    /** @example 'nodejs|Mongoose' */
    name: string;
    /** @example '6.9.0|8.7.0' */
    version: string;
  };
  /** @example 'Node.js v22.16.0, LE' */
  platform: string;
  os: {
    /** @example 'linux' */
    name: string;
    /** @example 'x64' */
    architecture: string;
    /** @example '6.2.0-1017-aws' */
    version: string;
    /** @example 'Linux' */
    type: string;
  };
  env: {
    container: {
      /** @example 'docker' */
      runtime: string;
    };
  };
}
interface InProgressOperation {
  /** @example '10.20.130.23:46014' */
  client: string;
  /** @example 'Conn' */
  desc: string;
  active: boolean;
  killPending: boolean;
  /** @example 487470 */
  opid: number;
  /** @example 'admin.$cmd' */
  ns: string;
  command: Command;
  lsid: {
    /** @example 'b58b6619-d218-4c7f-af9f-34fe2755e895' */
    id: string;
  };
  $db: 'admin';
  /** @example 0 */
  secs_running: number;
  /** @example 123 */
  microsecs_running: number;
  clientMetaData: ClientMetadata;
}

export interface CurrentOperation {
  inprog?: InProgressOperation[];
}
