import {
  Body,
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

import { AuthGuard, AuthRequest } from '@/users';
import Lesson from '@/entities/Lesson';
import { UsersService } from '@/users/users.service';
import { CreateLessonBodyDto } from './dto/create-lesson-body.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CourseAuthorGuard } from '../../course-author.guard';
import { LessonCreatorGuard } from './lesson-creator.guard';
import { LessonsService } from './lessons.service';
import { CoursesService } from '../../courses.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetLessonsDto } from '@/courses/modules/lessons/dto/get-lessons.dto';

@ApiTags('lessons')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You are not logged in' })
@UseGuards(AuthGuard)
@Controller('courses/:courseId/lessons')
export class LessonsController {
  constructor(
    @Inject(LessonsService) private readonly lessonService: LessonsService,
    @Inject(CoursesService) private readonly coursesService: CoursesService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get course all lessens with pagination' })
  @ApiQuery({ name: 'query', required: false })
  @ApiOkResponse({ type: GetLessonsDto })
  @Get()
  async get(
    @Param('courseId') courseId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('query') query?: string,
  ): Promise<GetLessonsDto> {
    return this.lessonService.getAllByCourseId(
      Number(courseId),
      Number(limit),
      Number(page),
      query,
    );
  }

  @ApiOperation({ summary: 'Get lesson by id' })
  @ApiOkResponse({ type: Lesson })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  @Get(':lessonId')
  async getOne(@Param('lessonId') lessonId: string): Promise<Lesson> {
    const lesson = await this.lessonService.getById(Number(lessonId));

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  @ApiOperation({ summary: 'Create lesson' })
  @ApiBody({ type: CreateLessonBodyDto })
  @ApiOkResponse({ type: Lesson })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @UseGuards(CourseAuthorGuard)
  @Post()
  async create(
    @Param('courseId') courseId: string,
    @Body() createLessonDto: CreateLessonBodyDto,
    @Req() req: AuthRequest,
  ): Promise<Lesson> {
    const course = await this.coursesService.getById(Number(courseId));
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const userId = req.user.id;
    const creator = await this.usersService.getById(userId);
    if (!creator) {
      throw new NotFoundException('Course not found');
    }

    return this.lessonService.create({
      ...createLessonDto,
      course,
      creator,
    });
  }

  @ApiOperation({ summary: 'Update lesson' })
  @ApiBody({ type: UpdateLessonDto })
  @ApiOkResponse({ type: Lesson })
  @ApiNotFoundResponse({ description: 'Lesson not found' })
  @UseGuards(LessonCreatorGuard)
  @Put(':lessonId')
  async update(
    @Param('lessonId') lessonId: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    const result = await this.lessonService.update(
      Number(lessonId),
      updateLessonDto,
    );

    if (!result) {
      throw new NotFoundException('Lesson not found');
    }

    return result;
  }

  @ApiOperation({ summary: 'Delete lesson' })
  @ApiOkResponse({ description: 'Success delete' })
  @UseGuards(LessonCreatorGuard)
  @Delete(':lessonId')
  async delete(@Param('lessonId') lessonId: string): Promise<void> {
    await this.lessonService.delete(Number(lessonId));
  }
}
