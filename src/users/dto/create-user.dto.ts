import Role from '@/entities/Role';

export class CreateUserDto {
  readonly lastName: string;
  readonly firstName: string;
  readonly patronymic: string;
  readonly login: string;
  readonly password: string;
  readonly roles?: Role[];
}
