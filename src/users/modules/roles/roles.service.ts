import { In, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { DefaultRoles, defaultRolesList } from './config';
import Role from '@/entities/Role';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {
    this.createDefaultRolesIfNotExists();
  }

  private async createDefaultRolesIfNotExists() {
    const defaultRoleCodes = defaultRolesList.map(({ code }) => code);

    const existRoles = await this.roleRepository.findBy({
      code: In(defaultRoleCodes),
    });

    const existRoleCodes = existRoles.map(({ code }) => code);

    for (const role of defaultRolesList) {
      if (existRoleCodes.includes(role.code)) {
        continue;
      }

      await this.roleRepository.save(role);
    }
  }

  async getByCode(code: DefaultRoles | string): Promise<Role | null> {
    return await this.roleRepository.findOneBy({ code });
  }

  async getAllByCodes(codes: DefaultRoles[] | string[]): Promise<Role[]> {
    return await this.roleRepository.findBy({ code: In(codes) });
  }
}
