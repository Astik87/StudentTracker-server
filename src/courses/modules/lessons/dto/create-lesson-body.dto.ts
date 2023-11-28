import { ApiProperty } from '@nestjs/swagger';

export class CreateLessonBodyDto {
  @ApiProperty()
  readonly name: string;

  @ApiProperty({ example: 1701008740385 })
  readonly date: number;
}
