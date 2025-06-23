import { ContextType } from '@nestjs/common';

export interface User {
  id: string;
}

export type CommonContextType = ContextType | 'rpc';
