import { ApiProperty } from '@nestjs/swagger';
import { Course } from '@/entities';

export class GetCoursesResultDto {
  @ApiProperty({ example: 15 })
  count: number;

  @ApiProperty({ type: [Course] })
  courses: Course[];
}
