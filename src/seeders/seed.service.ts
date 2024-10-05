import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/roles/entities/role.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async seedRoles() {
    const roles = [
      { name: 'admin', description: 'Administrator with full access to all resources.' },
      { name: 'emprendedor', description: '.' },
      { name: 'cliente', description: '.' },
    ];

    for (const roleData of roles) {
      const role = await this.roleRepository.findOne({ where: { name: roleData.name } });
      if (!role) {
        await this.roleRepository.save(this.roleRepository.create(roleData));
      }
    }
  }
}


