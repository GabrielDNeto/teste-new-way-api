import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

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

  async user(
    userWhereUniqueInput: Prisma.UserWhereUniqueInput,
  ): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: userWhereUniqueInput,
    });
  }

  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    const user = await this.user({ email: data.email });

    if (user) {
      throw new ConflictException(
        `User with email ${data.email} already exists`,
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
      throw new NotFoundException(`User with id ${where.id} does not exist`);
    }

    return this.prisma.user.update({
      data,
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
