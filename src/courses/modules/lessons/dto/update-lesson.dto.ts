import { ApiProperty } from '@nestjs/swagger';

export class UpdateLessonDto {
  @ApiProperty({ name: 'name?' })
  readonly name?: string;

  @ApiProperty({ name: 'date?', example: 1701008740385 })
  readonly date?: number;
}
