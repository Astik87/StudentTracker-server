import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import User from './User';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class Course {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column({ type: 'text' })
  description: string;

  @ApiProperty({ name: 'image!' })
  @Column({ nullable: true })
  image: string | null;

  @ApiProperty({ name: 'teacher?', type: User })
  @ManyToOne(() => User)
  teacher?: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

export default Course;
