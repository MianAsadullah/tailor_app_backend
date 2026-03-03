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
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.usersRepo.remove(user);
    return { success: true };
  }

  private toSafeUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

