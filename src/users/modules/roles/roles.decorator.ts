import { SetMetadata } from '@nestjs/common';
import { DefaultRoles } from '@/users';

export const ROLES_KEY = 'roles';

export const Roles = (...roles: DefaultRoles[] | string[]) =>
  SetMetadata(ROLES_KEY, roles);
