import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CourseRegistrationRequestStatuses } from '@/courses';
import User from './User';
import Course from './Course';
import { ApiProperty } from '@nestjs/swagger';

const courseRegistrationRequestStatuses = Object.entries(
  CourseRegistrationRequestStatuses,
)
  .map(([name, value]) => value)
  .join(' | ');

@Entity()
class CourseRegistrationRequest {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: courseRegistrationRequestStatuses })
  @Column({
    type: 'varchar',
    default: CourseRegistrationRequestStatuses.IN_PROCESS,
  })
  status: CourseRegistrationRequestStatuses;

  @ApiProperty({ name: 'user?', type: User })
  @ManyToOne(() => User)
  user?: User;

  @ApiProperty({ name: 'course?', type: Course })
  @ManyToOne(() => Course)
  course?: Course;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

export default CourseRegistrationRequest;
