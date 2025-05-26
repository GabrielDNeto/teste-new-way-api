import { forwardRef, Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { TasksController } from './tasks.controller';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
  providers: [TasksService, UserService],
  controllers: [TasksController],
  exports: [TasksService],
})
export class TasksModule {}
