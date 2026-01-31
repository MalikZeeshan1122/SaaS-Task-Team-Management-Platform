import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Prisma } from '@prisma/client';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) { }

    @Post()
    async create(@Body() createProjectDto: any, @Request() req: any) {
        try {
            return await this.projectsService.create({
                ...createProjectDto,
                owner: { connect: { id: req.user.userId } },
            });
        } catch (error) {
            console.error('Error creating project:', error);
            throw new Error(`Failed to create project: ${error.message}`);
        }
    }

    @Get()
    findAll(@Request() req: any) {
        return this.projectsService.findAll(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: Prisma.ProjectUpdateInput) {
        return this.projectsService.update(id, updateProjectDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectsService.remove(id);
    }
}
