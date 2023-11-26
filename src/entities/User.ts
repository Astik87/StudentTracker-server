import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import Token from './Token';
import Role from './Role';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  lastName: string;

  @ApiProperty()
  @Column()
  firstName: string;

  @ApiProperty()
  @Column({ nullable: true })
  patronymic: string;

  @ApiProperty()
  @Column({ nullable: false })
  fullName: string;

  @ApiProperty()
  @Column({ unique: true })
  login: string;

  @ApiProperty()
  @Column()
  password: string;

  @ApiProperty({ name: 'roles?', type: () => [Role] })
  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable()
  roles?: Role[];

  @OneToMany(() => Token, (token) => token.user)
  tokens?: Token[];

  @ApiProperty()
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updated_at: Date;
}

export default User;
