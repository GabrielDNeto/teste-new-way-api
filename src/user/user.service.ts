import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PaginatedResponse } from 'src/types/pagination';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async users(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.prisma.user.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }
  async usersPaginated(params: {
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page: number;
  }): Promise<PaginatedResponse<User>> {
    const { take, cursor, where, orderBy, page } = params;

    const limit = take || 10;

    const offset = (page - 1) * limit;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: offset,
        take: limit,
        cursor,
        where,
        orderBy,
      }),
      this.prisma.user.count({
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

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async userInfo(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<{ name: string; email: string; isAdmin: boolean } | null> {
    const user = await this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado!');
    }

    return {
      name: user.name,
      email: user.email,
      isAdmin: user?.isAdmin,
    };
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.user({ email: data.email });

    if (user) {
      throw new ConflictException(
        `Já existe um usuário cadastrado com o email informado`,
      );
    }

    const passHash = await bcrypt.hash(data.password, 10);

    return this.prisma.user.create({
      data: { ...data, password: passHash },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { data, where } = params;

    const user = await this.user(where);

    if (!user) {
      throw new NotFoundException(`Usuário não encontrado!`);
    }

    return this.prisma.user.update({
      data,
      where,
    });
  }

  async updateUserRole(params: {
    where: Prisma.UserWhereUniqueInput;
  }): Promise<User> {
    const { where } = params;
    const user = await this.user(where);

    if (!user) {
      throw new NotFoundException(`Usuário não encontrado!`);
    }

    return this.prisma.user.update({
      data: { isAdmin: !user.isAdmin },
      where,
    });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    const user = await this.user({ id: where.id });

    if (!user) {
      throw new NotFoundException(`User with id ${where.id} does not exist`);
    }

    return this.prisma.user.delete({
      where,
    });
  }
}
