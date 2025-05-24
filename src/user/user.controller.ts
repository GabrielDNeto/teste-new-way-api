import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from 'generated/prisma';

@Controller('users')
export class UserController {
  constructor(readonly userService: UserService) {}

  @Get()
  async getUsers() {
    return this.userService.users({});
  }

  @Get(':id')
  async getUser(id: string) {
    return this.userService.user({ id: Number(id) });
  }

  @Post()
  async createUser(
    @Body() userData: { name: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
