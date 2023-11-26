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

@Controller('courses/:courseId/lessons')
export class LessonsController {
  constructor(
    @Inject(LessonsService) private readonly lessonService: LessonsService,
    @Inject(CoursesService) private readonly coursesService: CoursesService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard)
  @Get()
  async get(
    @Param('courseId') courseId: string,
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('query') query?: string,
  ): Promise<Lesson[]> {
    return this.lessonService.getAllByCourseId(
      Number(courseId),
      Number(limit),
      Number(page),
      query,
    );
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getOne(@Param('id') id: string): Promise<Lesson> {
    const lesson = await this.lessonService.getById(Number(id));

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  @UseGuards(AuthGuard, CourseAuthorGuard)
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

  @UseGuards(AuthGuard, LessonCreatorGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson> {
    return this.lessonService.update(Number(id), updateLessonDto);
  }

  @UseGuards(AuthGuard, LessonCreatorGuard)
  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.lessonService.delete(Number(id));
  }
}
