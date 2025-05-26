import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Task } from 'generated/prisma';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserService } from 'src/user/user.service';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly taskService: TasksService,
    private readonly userService: UserService,
  ) {}

  @Get()
  async getTasks(@CurrentUser('sub') userId: number) {
    const user = await this.userService.user({ id: userId });
    if (user?.isAdmin) {
      return this.taskService.tasks({ orderBy: { updatedAt: 'desc' } });
    }
    return this.taskService.tasks({ where: { userId } });
  }

  @Get('paginated')
  async getTasksPaginated(
    @CurrentUser('sub') userId: number,
    @Query('current') current: string,
    @Query('items') items: string,
  ) {
    const user = await this.userService.user({ id: Number(userId) });

    if (user?.isAdmin) {
      return this.taskService.tasksPaginated({
        page: Number(current),
        take: Number(items),
        orderBy: { updatedAt: 'desc' },
      });
    }
    return this.taskService.tasksPaginated({
      page: Number(current),
      take: Number(items),
      orderBy: { updatedAt: 'desc' },
      where: { userId: Number(userId) },
    });
  }

  @Get(':id')
  async getTask(@Param('id') id: string) {
    return this.taskService.task({ id: Number(id) });
  }

  @Post()
  async createTask(
    @CurrentUser('sub') userId: number,
    @Body()
    data: {
      title: string;
      description: string;
      status: string;
    },
  ): Promise<Task> {
    return this.taskService.createTask({
      title: data.title,
      description: data.description,
      status: data.status,
      user: {
        connect: { id: userId },
      },
    });
  }

  @Put(':id')
  async updateTask(
    @Body() data: { title: string; description?: string; status?: string },
    @Param('id') id: string,
  ): Promise<Task> {
    return this.taskService.updateTask({
      where: { id: Number(id) },
      data,
    });
  }

  @Patch(':id')
  async updateTaskStatus(
    @Param('id') id: number,
    @Body() data: { status: string },
  ) {
    return this.taskService.updateTask({
      where: { id: Number(id) },
      data,
    });
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<Task> {
    return this.taskService.deleteTask({ id: Number(id) });
  }
}
