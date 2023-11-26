import { DefaultRoles } from '../../roles/config';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterByLoginDto {
  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly firstName: string;

  @ApiProperty()
  readonly patronymic: string;

  @ApiProperty()
  readonly login: string;

  @ApiProperty()
  readonly password: string;

  @ApiProperty({ example: `${DefaultRoles.STUDENT} | ${DefaultRoles.TEACHER}` })
  readonly role: DefaultRoles.STUDENT | DefaultRoles.TEACHER;
}
