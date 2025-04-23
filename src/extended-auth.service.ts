import { AuthService } from './auth/auth.service';

export class ExtendedAuthService extends AuthService {
  test(): void {
    console.log('Overrode auth service');
  }
}
