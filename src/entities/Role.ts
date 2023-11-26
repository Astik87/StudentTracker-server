import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class Role {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ unique: true })
  code: string;

  @ApiProperty()
  @Column()
  name: string;

  @ManyToMany(() => User, (user) => user.roles)
  users?: User[];
}

export default Role;
