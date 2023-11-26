import {
  CanActivate,
  ExecutionContext,
  Inject,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@/users/modules/roles/roles.decorator';
import { AuthService } from '@/users/modules/auth/auth.service';

export class RolesGuard implements CanActivate {
  constructor(
    @Inject(AuthService) private readonly authService: AuthService,
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles: string[] = this.reflector.getAllAndOverride(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    const req = context.switchToHttp().getRequest();
    const checkedToken = this.authService.checkUserIsAuth(req);

    if (!checkedToken) {
      throw new UnauthorizedException('You are not logged in');
    }

    req.user = checkedToken;
    return checkedToken.roles.some((role) => requiredRoles.includes(role));
  }
}
