import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from 'generated/prisma';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
export class UserController {
  constructor(readonly userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getUsers() {
    return this.userService.users({});
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getUser(id: string) {
    return this.userService.user({ id: Number(id) });
  }

  @UseGuards(AuthGuard)
  @Post()
  async createUser(
    @Body() userData: { name: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @UseGuards(AuthGuard)
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
