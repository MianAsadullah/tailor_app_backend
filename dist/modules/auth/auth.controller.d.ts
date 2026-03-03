import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthRequest } from '../../middlewares/auth.middleware';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
    verifyEmail(token: string): Promise<{
        success: boolean;
    }>;
    resendVerification(req: AuthRequest): Promise<{
        success: boolean;
        verificationToken?: undefined;
    } | {
        success: boolean;
        verificationToken: string;
    }>;
    refresh(req: AuthRequest): Promise<{
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
    changePassword(req: AuthRequest, dto: ChangePasswordDto): Promise<{
        success: boolean;
    }>;
    enableTwoFactor(req: AuthRequest): Promise<{
        success: boolean;
        secret: string;
    }>;
    verifyTwoFactor(req: AuthRequest, code: string): Promise<{
        success: boolean;
    }>;
    disableTwoFactor(req: AuthRequest): Promise<{
        success: boolean;
    }>;
    me(req: AuthRequest): Promise<{
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
}
