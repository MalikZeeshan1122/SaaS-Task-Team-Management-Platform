"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const prisma_service_1 = require("../prisma/prisma.service");
let AnalyticsController = class AnalyticsController {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getTaskStats(req) {
        const userId = req.user.userId;
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            select: { id: true }
        });
        const projectIds = projects.map(p => p.id);
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
    async getProductivityStats(req) {
        const userId = req.user.userId;
        const projects = await this.prisma.project.findMany({
            where: { ownerId: userId },
            select: { id: true }
        });
        const projectIds = projects.map(p => p.id);
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
        const dailyStats = {};
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dayName = dayNames[date.getDay()];
            dailyStats[dayName] = 0;
        }
        completedTasks.forEach(task => {
            const dayName = dayNames[new Date(task.updatedAt).getDay()];
            dailyStats[dayName] = (dailyStats[dayName] || 0) + 1;
        });
        return Object.entries(dailyStats).map(([name, count]) => ({
            name,
            count
        }));
    }
    async getProjectStats(req) {
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
    async getOverview(req) {
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
};
exports.AnalyticsController = AnalyticsController;
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats/tasks'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getTaskStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats/productivity'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getProductivityStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats/projects'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getProjectStats", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('stats/overview'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AnalyticsController.prototype, "getOverview", null);
exports.AnalyticsController = AnalyticsController = __decorate([
    (0, common_1.Controller)('analytics'),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AnalyticsController);
//# sourceMappingURL=analytics.controller.js.map