export type UserRole = 'customer' | 'tailor' | 'admin';
export declare class User {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    passwordHash: string;
    role: UserRole;
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
}
