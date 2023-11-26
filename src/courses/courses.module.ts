import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Course from '@/entities/Course';
import { AuthModule, UsersModule } from '@/users';
import { FilesModule } from '@/files';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { LessonsModule } from './modules/lessons';
import { CourseRegistrationsModule } from './modules/courseRegistrations/courseRegistrations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course]),
    UsersModule,
    AuthModule,
    FilesModule,
    forwardRef(() => LessonsModule),
    forwardRef(() => CourseRegistrationsModule),
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService],
})
export class CoursesModule {}
