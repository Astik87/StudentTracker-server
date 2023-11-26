import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import Course from './Course';

@Entity()
class CourseRegistration {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  user?: User;

  @ManyToOne(() => Course)
  course?: Course;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default CourseRegistration;
