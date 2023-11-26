import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule, UsersModule } from '@/users';
import { CourseRegistration, CourseRegistrationRequest } from '@/entities';
import { CourseRegistrationsService } from './courseRegistrations.service';
import { CourseRegistrationsController } from './courseRegistrations.controller';
import { CoursesModule } from '../../courses.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseRegistration, CourseRegistrationRequest]),
    forwardRef(() => CoursesModule),
    UsersModule,
    AuthModule,
  ],
  providers: [CourseRegistrationsService],
  controllers: [CourseRegistrationsController],
  exports: [CourseRegistrationsService],
})
export class CourseRegistrationsModule {}
