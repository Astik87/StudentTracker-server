import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Lesson from '@/entities/Lesson';
import { AuthModule, UsersModule } from '@/users';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { CoursesModule } from '../../courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Lesson]),
    forwardRef(() => CoursesModule),
    UsersModule,
    AuthModule,
  ],
  providers: [LessonsService],
  controllers: [LessonsController],
  exports: [LessonsService],
})
export class LessonsModule {}
