import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import Course from './Course';
import User from './User';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class Lesson {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  date: Date;

  @ApiProperty({ name: 'creator?', type: User })
  @ManyToOne(() => User)
  creator?: User;

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

export default Lesson;
