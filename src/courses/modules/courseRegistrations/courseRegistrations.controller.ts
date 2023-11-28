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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCourseUsersDto } from './dto/get-course-users.dto';

@ApiTags('Course registration')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You are not logged in' })
@ApiNotFoundResponse({ description: 'Course not found' })
@UseGuards(AuthGuard)
@Controller('courses/:courseId/registrations')
export class CourseRegistrationsController {
  constructor(
    @Inject(CoursesService) private readonly coursesService: CoursesService,
    @Inject(CourseRegistrationsService)
    private readonly courseRegistrationsService: CourseRegistrationsService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Unregister in the course [Student]' })
  @ApiOkResponse({ description: 'Unregister success' })
  @ApiForbiddenResponse()
  @ApiBadRequestResponse({ description: 'User not registered in course' })
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

  @ApiOperation({ summary: 'Get course all registered users with pagination' })
  @ApiOkResponse({ type: GetCourseUsersDto })
  @ApiQuery({ name: 'query', required: false })
  @Get('/users')
  async getRegisteredUsers(
    @Param('courseId') courseId: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
    @Query('query') query?: string,
  ): Promise<GetCourseUsersDto> {
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

  @ApiOperation({ summary: 'Send registration request [Student]' })
  @ApiOkResponse({ type: CourseRegistrationRequest })
  @ApiNotFoundResponse({ description: 'User not found || Course not found' })
  @ApiBadRequestResponse({
    description:
      'You are already registered for the course || The registration request has already been sent',
  })
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

  @ApiOperation({ summary: 'Access registration request [Teacher]' })
  @ApiOkResponse({ description: 'Success access registration request' })
  @ApiNotFoundResponse({
    description: 'Course not found || Course registration request not found',
  })
  @ApiForbiddenResponse()
  @UseGuards(CourseAuthorGuard)
  @Put('/registration-request/:registrationRequestId')
  async accessCourseRegistrationRequest(
    @Param('courseId') courseId: string,
    @Param('registrationRequestId') registrationRequestId: string,
  ): Promise<void> {
    const course = this.coursesService.getById(Number(courseId));

    if (!course) {
      throw new NotFoundException('Course not found');
    }

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

  @ApiOperation({ summary: 'Reject course registration request [Teacher]' })
  @ApiOkResponse({ description: 'Success reject course registration request' })
  @ApiForbiddenResponse()
  @ApiNotFoundResponse({
    description: 'Course not found || Course registration request not found',
  })
  @UseGuards(CourseAuthorGuard)
  @Delete('/registration-request/:registrationRequestId')
  async rejectCourseRegistrationRequest(
    @Param('courseId') courseId: string,
    @Param('registrationRequestId') registrationRequestId: string,
  ): Promise<void> {
    const course = this.coursesService.getById(Number(courseId));

    if (!course) {
      throw new NotFoundException('Course not found');
    }

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
