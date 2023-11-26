import { DefaultRoles } from '../../roles/config';

export class TokenPayloadDto {
  readonly id: number;
  readonly login: string;
  readonly roles: DefaultRoles[] | string[];
}
