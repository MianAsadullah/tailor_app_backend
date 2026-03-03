import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findAll(requestingUserRole: string) {
    if (requestingUserRole !== 'admin') {
      throw new ForbiddenException('Only admin can list users');
    }
    const users = await this.usersRepo.find();
    return users.map((u) => this.toSafeUser(u));
  }

  async findOne(id: string) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toSafeUser(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, dto);
    const saved = await this.usersRepo.save(user);
    return this.toSafeUser(saved);
  }

  async remove(id: string) {
    const result = await this.usersRepo.softDelete({ id });
    if (!result.affected) {
      throw new NotFoundException('User not found');
    }
    return { success: true };
  }

  async updateRole(id: string, role: User['role']) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.role = role;
    const saved = await this.usersRepo.save(user);
    return this.toSafeUser(saved);
  }

  async updateStatus(id: string, isActive: boolean) {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.isActive = isActive;
    const saved = await this.usersRepo.save(user);
    return this.toSafeUser(saved);
  }

  async stats() {
    const total = await this.usersRepo.count();
    const active = await this.usersRepo.count({ where: { isActive: true } });
    const byRole = await this.usersRepo
      .createQueryBuilder('user')
      .select('user.role', 'role')
      .addSelect('COUNT(*)', 'count')
      .groupBy('user.role')
      .getRawMany();

    return { total, active, byRole };
  }

  async activityLog() {
    // Simplified: return latest users as an "activity" list
    const recent = await this.usersRepo.find({
      order: { updatedAt: 'DESC' },
      take: 20,
    });
    return recent.map((u) => this.toSafeUser(u));
  }

  private toSafeUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

