import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import User from '@/entities/User';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from './modules/roles/roles.service';
import { DefaultRoles } from './modules/roles/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(userDto: CreateUserDto): Promise<User> {
    const fullName = [
      userDto.lastName,
      userDto.lastName,
      userDto.patronymic,
    ].join(' ');

    return this.userRepository.save({
      ...userDto,
      password: await bcrypt.hash(userDto.password, 10),
      fullName: fullName,
    });
  }

  async getById(id: number): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  async getByLogin(login: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { login },
      relations: ['roles'],
    });
  }

  async addRole(userId: number, roleCode: string): Promise<User> {
    const user = await this.getById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const role = await this.rolesService.getByCode(roleCode);

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    user.roles.push(role);

    return await this.userRepository.save(user);
  }

  async setRoles(
    userId: number,
    roleCodes: DefaultRoles[] | string[],
  ): Promise<User> {
    const user = await this.getById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const roles = await this.rolesService.getAllByCodes(roleCodes);

    user.roles = roles;

    return await this.userRepository.save(user);
  }
}
