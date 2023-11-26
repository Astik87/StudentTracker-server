import { ApiProperty } from '@nestjs/swagger';

export class AuthByLoginDto {
  @ApiProperty()
  readonly login: string;
  @ApiProperty()
  readonly password: string;
}
