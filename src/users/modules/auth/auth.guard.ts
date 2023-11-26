import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

export class AuthGuard implements CanActivate {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    const tokenPayload = this.authService.checkUserIsAuth(req);

    console.log(tokenPayload);

    if (!tokenPayload) {
      throw new UnauthorizedException('You are not logged in');
    }

    req.user = tokenPayload;
    return Boolean(tokenPayload);
  }
}
