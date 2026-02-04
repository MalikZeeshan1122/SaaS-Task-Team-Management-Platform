import { Controller, Get, Patch, Body, UseGuards, Request, BadRequestException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';

// Ensure uploads directory exists
const uploadsDir = join(process.cwd(), 'uploads', 'avatars');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getProfile(@Request() req) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        // Return user without password
        const { password, ...result } = user;
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    async updateProfile(@Request() req, @Body() body: { name?: string; email?: string }) {
        const user = await this.usersService.update(req.user.userId, {
            name: body.name,
            email: body.email,
        });
        const { password, ...result } = user;
        return result;
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me/password')
    async updatePassword(
        @Request() req,
        @Body() body: { currentPassword: string; newPassword: string }
    ) {
        const user = await this.usersService.findOne(req.user.userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(body.currentPassword, user.password);
        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Update password
        await this.usersService.update(req.user.userId, {
            password: body.newPassword,
        });

        return { message: 'Password updated successfully' };
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me/avatar')
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: uploadsDir,
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, `avatar-${uniqueSuffix}${extname(file.originalname)}`);
            },
        }),
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|webp)$/)) {
                return cb(new BadRequestException('Only image files are allowed'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, // 5MB
        },
    }))
    async uploadAvatar(@Request() req, @UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('No file uploaded');
        }

        const avatarUrl = `/uploads/avatars/${file.filename}`;

        const user = await this.usersService.update(req.user.userId, {
            avatarUrl,
        });

        const { password, ...result } = user;
        return result;
    }
}
