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
class Token {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  refreshToken: string;

  @ApiProperty()
  @Column({ unique: true })
  accessToken: string;

  @ApiProperty({ type: () => User, name: 'user?' })
  @ManyToOne(() => User, (user) => user.tokens)
  user?: User;

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

export default Token;
