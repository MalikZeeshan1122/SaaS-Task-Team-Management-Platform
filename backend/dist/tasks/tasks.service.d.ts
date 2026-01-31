import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    create(data: Prisma.TaskCreateInput): Prisma.Prisma__TaskClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    findAll(userId: string): Prisma.PrismaPromise<({
        project: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            startDate: Date | null;
            endDate: Date | null;
            totalTimeSpent: number;
            ownerId: string;
        };
        assignee: {
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    })[]>;
    findOne(id: string): Prisma.Prisma__TaskClient<{
        project: {
            name: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            startDate: Date | null;
            endDate: Date | null;
            totalTimeSpent: number;
            ownerId: string;
        };
        assignee: {
            name: string | null;
            id: string;
            email: string;
            password: string;
            role: import(".prisma/client").$Enums.Role;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
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
    }, null, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    update(id: string, data: Prisma.TaskUpdateInput): Prisma.Prisma__TaskClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
    remove(id: string): Prisma.Prisma__TaskClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, Prisma.PrismaClientOptions>;
}
