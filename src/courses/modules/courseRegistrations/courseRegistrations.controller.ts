import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { User } from '@/entities';
import {
  AuthGuard,
  UsersService,
  DefaultRoles,
  RolesGuard,
  Roles,
  AuthRequest,
} from '@/users';
import { CourseAuthorGuard } from '../../course-author.guard';
import { CoursesService } from '../../courses.service';
import { CourseRegistrationsService } from './courseRegistrations.service';
import { CourseRegistrationRequest } from '@/entities';

@UseGuards(AuthGuard)
@Controller('courses/:courseId/registrations')
export class CourseRegistrationsController {
  constructor(
    @Inject(CoursesService) private readonly coursesService: CoursesService,
    @Inject(CourseRegistrationsService)
    private readonly courseRegistrationsService: CourseRegistrationsService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @Roles(DefaultRoles.STUDENT)
  @UseGuards(RolesGuard)
  @Delete('/unregister')
  async unregisterUser(
    @Param('courseId') courseId: string,
    @Req() req: AuthRequest,
  ): Promise<void> {
    const { id: userId } = req.user;

    const userIsRegistered =
      await this.courseRegistrationsService.checkUserIsRegistered(
        Number(courseId),
        Number(userId),
      );

    if (!userIsRegistered) {
      throw new BadRequestException('User not registered in course');
    }

    await this.courseRegistrationsService.unregisterUserForCourse(
      Number(courseId),
      Number(userId),
    );
  }

  @Get('/users')
  async getRegisteredUsers(
    @Param('courseId') courseId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('query') query?: string,
  ): Promise<User[]> {
    const course = await this.coursesService.getById(Number(courseId));

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.courseRegistrationsService.getRegisteredUsers(
      Number(courseId),
      Number(limit),
      Number(page),
      query,
    );
  }

  @Roles(DefaultRoles.STUDENT)
  @UseGuards(RolesGuard)
  @Post('/registration-request')
  async createCourseRegistrationRequest(
    @Param('courseId') courseId: string,
    @Req() req: AuthRequest,
  ): Promise<CourseRegistrationRequest> {
    const course = await this.coursesService.getById(Number(courseId));
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const { id: userId } = req.user;
    const user = await this.usersService.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const checkUserIsRegistered =
      await this.courseRegistrationsService.checkUserIsRegistered(
        Number(courseId),
        userId,
      );
    if (checkUserIsRegistered) {
      throw new BadRequestException(
        'You are already registered for the course',
      );
    }

    const userCourseRegistrationRequest =
      await this.courseRegistrationsService.getRequestByUserAndCourseId(
        Number(courseId),
        userId,
      );
    if (userCourseRegistrationRequest) {
      throw new BadRequestException(
        'The registration request has already been sent',
      );
    }

    return await this.courseRegistrationsService.createRequest(course, user);
  }

  @UseGuards(CourseAuthorGuard)
  @Put('/registration-request/:registrationRequestId')
  async accessCourseRegistrationRequest(
    @Param('registrationRequestId') registrationRequestId: string,
  ): Promise<void> {
    const courseRegistrationRequest =
      await this.courseRegistrationsService.getRequestById(
        Number(registrationRequestId),
      );

    if (!courseRegistrationRequest) {
      throw new NotFoundException('Course registration request not found');
    }

    await this.courseRegistrationsService.accessRequest(
      courseRegistrationRequest.id,
    );
  }

  @UseGuards(CourseAuthorGuard)
  @Delete('/registration-request/:registrationRequestId')
  async rejectCourseRegistrationRequest(
    @Param('registrationRequestId') registrationRequestId: string,
  ): Promise<void> {
    const courseRegistrationRequest =
      await this.courseRegistrationsService.getRequestById(
        Number(registrationRequestId),
      );

    if (!courseRegistrationRequest) {
      throw new NotFoundException('Course registration request not found');
    }

    await this.courseRegistrationsService.rejectRequest(
      courseRegistrationRequest.id,
    );
  }
}
