import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [],
  providers: [PrismaService, UserService],
  controllers: [UserController],
  exports: [],
})
export class UserModule {}
