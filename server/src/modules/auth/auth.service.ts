import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
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

    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    const user = this.usersRepo.create({
      name: dto.name,
      email: dto.email,
      phone: dto.phone ?? null,
      passwordHash,
      role: dto.role ?? 'customer',
      isActive: true,
      isEmailVerified: false,
      emailVerificationToken,
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

  async refreshToken(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const token = signToken({ sub: user.id, role: user.role });
    return { token };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    if (!dto.email && !dto.phone) {
      throw new BadRequestException('Email or phone is required');
    }

    const user = await this.usersRepo.findOne({
      where: dto.email ? { email: dto.email } : { phone: dto.phone },
    });

    if (!user) {
      // Do not leak which accounts exist
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = token;
    user.passwordResetExpiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await this.usersRepo.save(user);

    // In real app: send email/SMS with this token
    return { success: true, resetToken: token };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.usersRepo.findOne({
      where: { passwordResetToken: dto.token },
    });

    if (
      !user ||
      !user.passwordResetExpiresAt ||
      user.passwordResetExpiresAt.getTime() < Date.now()
    ) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetExpiresAt = null;

    await this.usersRepo.save(user);

    return { success: true };
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepo.findOne({
      where: { emailVerificationToken: token },
    });
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    await this.usersRepo.save(user);

    return { success: true };
  }

  async resendVerification(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.isEmailVerified) {
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    await this.usersRepo.save(user);

    // In real app, email this token as a link
    return { success: true, verificationToken: token };
  }

  async enableTwoFactor(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const secret = crypto.randomBytes(20).toString('hex');
    user.twoFactorSecret = secret;
    user.twoFactorEnabled = false;
    await this.usersRepo.save(user);

    // In real app, you would generate a QR code / OTP URI
    return { success: true, secret };
  }

  async verifyTwoFactor(userId: string, code: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user || !user.twoFactorSecret) {
      throw new BadRequestException('2FA not initialized');
    }

    // Simplified: for now accept any code if secret exists
    if (!code) {
      throw new BadRequestException('Invalid 2FA code');
    }

    user.twoFactorEnabled = true;
    await this.usersRepo.save(user);

    return { success: true };
  }

  async disableTwoFactor(userId: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.twoFactorEnabled = false;
    user.twoFactorSecret = null;
    await this.usersRepo.save(user);

    return { success: true };
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await bcrypt.compare(dto.oldPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Old password is incorrect');
    }

    const passwordHash = await bcrypt.hash(dto.newPassword, 10);
    user.passwordHash = passwordHash;

    await this.usersRepo.save(user);

    return { success: true };
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

