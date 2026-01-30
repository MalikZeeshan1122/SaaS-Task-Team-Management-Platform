import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Project } from '@prisma/client';

@Injectable()
export class ProjectsService {
    constructor(private prisma: PrismaService) { }

    create(data: Prisma.ProjectCreateInput) {
        return this.prisma.project.create({ data });
    }

    findAll(userId: string) {
        return this.prisma.project.findMany({
            where: { ownerId: userId },
            include: { tasks: true },
        });
    }

    findOne(id: string) {
        return this.prisma.project.findUnique({ where: { id }, include: { tasks: true } });
    }

    update(id: string, data: Prisma.ProjectUpdateInput) {
        return this.prisma.project.update({ where: { id }, data });
    }

    remove(id: string) {
        return this.prisma.project.delete({ where: { id } });
    }
}
