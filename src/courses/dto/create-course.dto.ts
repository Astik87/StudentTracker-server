import User from '@/entities/User';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly description: string;

  @ApiProperty({ format: 'binary' })
  readonly image: string;
  readonly teacher: User;
}
