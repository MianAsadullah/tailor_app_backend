import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class AuthService {
    private readonly usersRepo;
    constructor(usersRepo: Repository<User>);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            passwordResetToken: string | null;
            passwordResetExpiresAt: Date | null;
            isEmailVerified: boolean;
            emailVerificationToken: string | null;
            twoFactorEnabled: boolean;
            twoFactorSecret: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: {
            id: string;
            name: string;
            email: string;
            phone: string | null;
            role: import("../users/user.entity").UserRole;
            isActive: boolean;
            passwordResetToken: string | null;
            passwordResetExpiresAt: Date | null;
            isEmailVerified: boolean;
            emailVerificationToken: string | null;
            twoFactorEnabled: boolean;
            twoFactorSecret: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
    refreshToken(userId: string): Promise<{
        token: string;
    }>;
    forgotPassword(dto: ForgotPasswordDto): Promise<{
        success: boolean;
        resetToken?: undefined;
    } | {
        success: boolean;
        resetToken: string;
    }>;
    resetPassword(dto: ResetPasswordDto): Promise<{
        success: boolean;
    }>;
    verifyEmail(token: string): Promise<{
        success: boolean;
    }>;
    resendVerification(userId: string): Promise<{
        success: boolean;
        verificationToken?: undefined;
    } | {
        success: boolean;
        verificationToken: string;
    }>;
    enableTwoFactor(userId: string): Promise<{
        success: boolean;
        secret: string;
    }>;
    verifyTwoFactor(userId: string, code: string): Promise<{
        success: boolean;
    }>;
    disableTwoFactor(userId: string): Promise<{
        success: boolean;
    }>;
    changePassword(userId: string, dto: ChangePasswordDto): Promise<{
        success: boolean;
    }>;
    getMe(userId: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string | null;
        role: import("../users/user.entity").UserRole;
        isActive: boolean;
        passwordResetToken: string | null;
        passwordResetExpiresAt: Date | null;
        isEmailVerified: boolean;
        emailVerificationToken: string | null;
        twoFactorEnabled: boolean;
        twoFactorSecret: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    logout(): Promise<{
        success: boolean;
    }>;
    private toSafeUser;
}
