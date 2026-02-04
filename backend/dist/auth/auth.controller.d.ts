import { AuthService } from './auth.service';
import { Prisma } from '@prisma/client';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signIn(signInDto: Record<string, any>): Promise<any>;
    signUp(signUpDto: Prisma.UserCreateInput): Promise<{
        name: string | null;
        id: string;
        email: string;
        password: string;
        avatarUrl: string | null;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
