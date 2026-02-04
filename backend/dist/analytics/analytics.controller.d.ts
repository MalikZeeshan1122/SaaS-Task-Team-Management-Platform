import { PrismaService } from '../prisma/prisma.service';
export declare class AnalyticsController {
    private prisma;
    constructor(prisma: PrismaService);
    getTaskStats(req: any): Promise<{
        completed: number;
        in_progress: number;
        todo: number;
        total: number;
        completionRate: number;
        byPriority: {
            high: number;
            medium: number;
            low: number;
        };
    }>;
    getProductivityStats(req: any): Promise<{
        name: string;
        count: number;
    }[]>;
    getProjectStats(req: any): Promise<{
        id: string;
        name: string;
        totalTasks: number;
        completed: number;
        inProgress: number;
        todo: number;
        progress: number;
    }[]>;
    getOverview(req: any): Promise<{
        recentActivity: {
            id: string;
            title: string;
            status: import(".prisma/client").$Enums.Status;
            projectName: string;
            updatedAt: Date;
        }[];
        completed: number;
        in_progress: number;
        todo: number;
        total: number;
        completionRate: number;
        byPriority: {
            high: number;
            medium: number;
            low: number;
        };
        totalProjects: number;
    }>;
}
