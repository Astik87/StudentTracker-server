import { ApiProperty } from '@nestjs/swagger';

export class UpdateCourseDto {
  @ApiProperty({ name: 'name?' })
  readonly name?: string;

  @ApiProperty({ name: 'description?' })
  readonly description?: string;

  @ApiProperty({ name: 'image?', format: 'binary' })
  readonly image?: string;
}
