import { Lesson } from '@/entities';
import { ApiProperty } from '@nestjs/swagger';

export class GetLessonsDto {
  @ApiProperty()
  readonly count: number;

  @ApiProperty({ type: [Lesson] })
  readonly lessons: Lesson[];
}
