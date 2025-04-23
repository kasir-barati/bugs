import { ModuleMetadata, Provider, Type } from '@nestjs/common';

export interface IAuthService {
  test(): void;
}
export interface Options {
  providers?: Provider[];
}
export interface OptionsFactory {
  createOptions(): Promise<Options> | Options;
}
export interface AsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<OptionsFactory>;
  useClass?: Type<OptionsFactory>;
  useFactory?: (...args: any[]) => Promise<Options> | Options;
  inject?: any[];
}
