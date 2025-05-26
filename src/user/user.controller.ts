import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { User as UserModel } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { UserService } from './user.service';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.users({ orderBy: { name: 'asc' } });
  }

  @Get('paginated')
  async getUsersPaginated(
    @Query('current') current: string,
    @Query('items') items: string,
  ) {
    return this.userService.usersPaginated({
      page: Number(current),
      take: Number(items),
      orderBy: { updatedAt: 'desc' },
    });
  }

  @Get('me')
  async getUserInfo(@CurrentUser('sub') userId: number) {
    return this.userService.userInfo({ id: userId });
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.user({ id: Number(id) });
  }

  @Public()
  @Post()
  async createUser(
    @Body() userData: { name: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Put(':id')
  async updateUser(
    @Body() userData: { name: string; email: string; password: string },
    id: string,
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }

  @Get('change-role/:id')
  async updateUserRole(@Param('id') id: string) {
    return this.userService.updateUserRole({ where: { id: Number(id) } });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
