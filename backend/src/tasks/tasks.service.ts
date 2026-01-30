import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Task } from '@prisma/client';

@Injectable()
export class TasksService {
    constructor(private prisma: PrismaService) { }

    create(data: Prisma.TaskCreateInput) {
        return this.prisma.task.create({ data });
    }

    findAll(userId: string) {
        return this.prisma.task.findMany({
            where: {
                OR: [
                    { assigneeId: userId },
                    { creatorId: userId },
                ],
            },
            include: { project: true, assignee: true },
        });
    }

    findOne(id: string) {
        return this.prisma.task.findUnique({ where: { id }, include: { project: true, assignee: true } });
    }

    update(id: string, data: Prisma.TaskUpdateInput) {
        return this.prisma.task.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.task.delete({ where: { id } });
    }
}
