import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('analytics')
export class AnalyticsController {
    constructor(private prisma: PrismaService) { }

    @UseGuards(JwtAuthGuard)
    @Get('stats/tasks')
    async getTaskStats(@Request() req) {
        const userId = req.user.userId;

        // Get all projects for this user
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            select: { id: true }
        });
        const projectIds = projects.map(p => p.id);

        // Count tasks by status
        const [completed, inProgress, todo, total] = await Promise.all([
            this.prisma.task.count({
                where: { projectId: { in: projectIds }, status: 'DONE' }
            }),
            this.prisma.task.count({
                where: { projectId: { in: projectIds }, status: 'IN_PROGRESS' }
            }),
            this.prisma.task.count({
                where: { projectId: { in: projectIds }, status: 'TODO' }
            }),
            this.prisma.task.count({
                where: { projectId: { in: projectIds } }
            })
        ]);

        // Count tasks by priority
        const [highPriority, mediumPriority, lowPriority] = await Promise.all([
            this.prisma.task.count({
                where: { projectId: { in: projectIds }, priority: 'HIGH' }
            }),
            this.prisma.task.count({
                where: { projectId: { in: projectIds }, priority: 'MEDIUM' }
            }),
            this.prisma.task.count({
                where: { projectId: { in: projectIds }, priority: 'LOW' }
            })
        ]);

        return {
            completed,
            in_progress: inProgress,
            todo,
            total,
            completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
            byPriority: {
                high: highPriority,
                medium: mediumPriority,
                low: lowPriority
            }
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats/productivity')
    async getProductivityStats(@Request() req) {
        const userId = req.user.userId;

        // Get all projects for this user
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            select: { id: true }
        });
        const projectIds = projects.map(p => p.id);

        // Get tasks completed in the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const completedTasks = await this.prisma.task.findMany({
            where: {
                projectId: { in: projectIds },
                status: 'DONE',
                updatedAt: { gte: sevenDaysAgo }
            },
            select: {
                updatedAt: true
            }
        });

        // Group by day
        const dailyStats: { [key: string]: number } = {};
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        // Initialize all days of the week
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = dayNames[date.getDay()];
            dailyStats[dayName] = 0;
        }

        // Count completed tasks per day
        completedTasks.forEach(task => {
            const dayName = dayNames[new Date(task.updatedAt).getDay()];
            dailyStats[dayName] = (dailyStats[dayName] || 0) + 1;
        });

        // Convert to array format
        return Object.entries(dailyStats).map(([name, count]) => ({
            name,
            count
        }));
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats/projects')
    async getProjectStats(@Request() req) {
        const userId = req.user.userId;

        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            include: {
                tasks: {
                    select: { status: true, priority: true }
                }
            }
        });

        return projects.map(project => ({
            id: project.id,
            name: project.name,
            totalTasks: project.tasks.length,
            completed: project.tasks.filter(t => t.status === 'DONE').length,
            inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
            todo: project.tasks.filter(t => t.status === 'TODO').length,
            progress: project.tasks.length > 0
                ? Math.round((project.tasks.filter(t => t.status === 'DONE').length / project.tasks.length) * 100)
                : 0
        }));
    }

    @UseGuards(JwtAuthGuard)
    @Get('stats/overview')
    async getOverview(@Request() req) {
        const userId = req.user.userId;

        const [projectCount, taskStats, recentTasks] = await Promise.all([
            this.prisma.project.count({ where: { ownerId: userId } }),
            this.getTaskStats(req),
            this.prisma.task.findMany({
                where: {
                    project: { ownerId: userId }
                },
                orderBy: { updatedAt: 'desc' },
                take: 5,
                include: {
                    project: { select: { name: true } }
                }
            })
        ]);

        return {
            totalProjects: projectCount,
            ...taskStats,
            recentActivity: recentTasks.map(t => ({
                id: t.id,
                title: t.title,
                status: t.status,
                projectName: t.project.name,
                updatedAt: t.updatedAt
            }))
        };
    }
}
