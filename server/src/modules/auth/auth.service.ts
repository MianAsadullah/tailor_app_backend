import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { signToken } from '../../utils/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      passwordHash,
      role: dto.role ?? 'customer',
      isActive: true,
    });

    const saved = await this.usersRepo.save(user);

    const token = signToken({ sub: saved.id, role: saved.role });

    return {
      token,
      user: this.toSafeUser(saved),
    };
  }

  async login(dto: LoginDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone is required');
    }
    if (!dto.password) {
      throw new BadRequestException('Password is required');
    }

    const user = await this.usersRepo.findOne({
      where: dto.email
        ? { email: dto.email, isActive: true }
        : { phone: dto.phone, isActive: true },
    });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = signToken({ sub: user.id, role: user.role });

    return {
      token,
      user: this.toSafeUser(user),
    };
  }

  async getMe(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toSafeUser(user);
  }

  async logout() {
    // Stateless JWT logout; client should discard token
    return { success: true };
  }

  private toSafeUser(user: User) {
    const { passwordHash, ...rest } = user;
    return rest;
  }
}

