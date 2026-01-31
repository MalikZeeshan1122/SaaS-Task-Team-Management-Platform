import { ProjectsService } from './projects.service';
import { Prisma } from '@prisma/client';
export declare class ProjectsController {
    private readonly projectsService;
    constructor(projectsService: ProjectsService);
    create(createProjectDto: any, req: any): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
        totalTimeSpent: number;
        ownerId: string;
    }>;
    findAll(req: any): Prisma.PrismaPromise<({
        tasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            status: import(".prisma/client").$Enums.Status;
            priority: import(".prisma/client").$Enums.Priority;
            projectId: string;
            assigneeId: string | null;
            creatorId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
        totalTimeSpent: number;
        ownerId: string;
    })[]>;
    findOne(id: string): Prisma.Prisma__ProjectClient<{
        tasks: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            title: string;
            status: import(".prisma/client").$Enums.Status;
            priority: import(".prisma/client").$Enums.Priority;
            projectId: string;
            assigneeId: string | null;
            creatorId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
        totalTimeSpent: number;
        ownerId: string;
    }, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, updateProjectDto: Prisma.ProjectUpdateInput): Prisma.Prisma__ProjectClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
        totalTimeSpent: number;
        ownerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    remove(id: string): Prisma.Prisma__ProjectClient<{
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        startDate: Date | null;
        endDate: Date | null;
        totalTimeSpent: number;
        ownerId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
