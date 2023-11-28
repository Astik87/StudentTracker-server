import { User } from '@/entities';
import { ApiProperty } from '@nestjs/swagger';

export class GetCourseUsersDto {
  @ApiProperty()
  readonly count: number;

  @ApiProperty({ type: [User] })
  readonly users: User[];
}
