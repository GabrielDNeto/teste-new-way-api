import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, Task } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { PaginatedResponse } from 'src/types/pagination';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async tasks(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
  }): Promise<Task[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.task.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async tasksPaginated(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.TaskWhereUniqueInput;
    where?: Prisma.TaskWhereInput;
    orderBy?: Prisma.TaskOrderByWithRelationInput;
    page: number;
  }): Promise<PaginatedResponse<Task>> {
    const { take, cursor, where, orderBy, page } = params;

    const limit = take || 10;

    const offset = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.task.findMany({
        skip: offset,
        take: limit,
        cursor,
        where,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.task.count({
        where,
      }),
    ]);

    return {
      data,
      meta: {
        current: page,
        total,
      },
    };
  }

  async task(
    taskWhereUniqueInput: Prisma.TaskWhereUniqueInput,
  ): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });
  }

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    const task = await this.prisma.task.findFirst({
      where: { title: data.title },
    });

    if (task) {
      throw new ConflictException(
        `Já existe uma tarefa criada com o título informado`,
      );
    }

    return this.prisma.task.create({
      data,
    });
  }

  async updateTask(params: {
    where: Prisma.TaskWhereUniqueInput;
    data: Prisma.TaskUpdateInput;
  }): Promise<Task> {
    const { data, where } = params;

    const user = await this.task(where);

    if (!user) {
      throw new NotFoundException(`Tarefa não encontrada!`);
    }

    return this.prisma.task.update({
      data,
      where,
    });
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    const user = await this.task({ id: where.id });

    if (!user) {
      throw new NotFoundException(`Tarefa não encontrada!`);
    }

    return this.prisma.task.delete({
      where,
    });
  }
}
