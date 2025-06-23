import { User } from './app.type';

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
