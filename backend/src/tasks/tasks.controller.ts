import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Post()
    create(@Body() createTaskDto: any, @Request() req: any) {
        const { projectId, assigneeId, ...rest } = createTaskDto;
        const data: Prisma.TaskCreateInput = {
            ...rest,
            creator: { connect: { id: req.user.userId } },
            project: { connect: { id: projectId } },
        };

        if (assigneeId) {
            data.assignee = { connect: { id: assigneeId } };
        }

        return this.tasksService.create(data);
    }

    @Get()
    findAll(@Request() req: any) {
        return this.tasksService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: Prisma.TaskUpdateInput) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}
