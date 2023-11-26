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

@Entity()
class CourseRegistrationRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    default: CourseRegistrationRequestStatuses.IN_PROCESS,
  })
  status: CourseRegistrationRequestStatuses;

  @ManyToOne(() => User)
  user?: User;

  @ManyToOne(() => Course)
  course?: Course;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CourseRegistrationRequest;
