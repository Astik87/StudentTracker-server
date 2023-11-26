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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import Course from '@/entities/Course';
import { AuthGuard, DefaultRoles, RolesGuard, Roles } from '@/users';
import { CourseAuthorGuard } from './course-author.guard';
import { CoursesService } from '@/courses/courses.service';
import { FilesService } from '@/files/files.service';
import { UsersService } from '@/users/users.service';
import { AuthRequest } from '@/users';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiSecurity,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { GetCoursesResultDto } from '@/courses/dto/get-courses-result.dto';
import { CreateCourseDto } from '@/courses/dto/create-course.dto';
import { UpdateCourseDto } from '@/courses/dto/update-course.dto';

@ApiTags('Courses')
@ApiSecurity('bearer')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'You are not logged in' })
@UseGuards(AuthGuard)
@Controller('courses')
export class CoursesController {
  constructor(
    @Inject(CoursesService) private readonly coursesService: CoursesService,
    @Inject(FilesService) private readonly filesService: FilesService,
    @Inject(UsersService) private readonly usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Get all courses with pagination ' })
  @ApiOkResponse({ type: GetCoursesResultDto })
  @Get()
  async get(
    @Query('limit') limit: string,
    @Query('page') page: string,
    @Query('query')
    query?: string,
  ): Promise<GetCoursesResultDto> {
    return await this.coursesService.getAll(Number(limit), Number(page), query);
  }

  @ApiOperation({ summary: 'Get course' })
  @ApiOkResponse({ type: Course })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @Get(':courseId')
  async getOne(@Param('id') id: number): Promise<Course> {
    const course = this.coursesService.getById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  @ApiOperation({ summary: 'Create course [Teacher]' })
  @ApiBody({ type: CreateCourseDto })
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({ type: Course })
  @Roles(DefaultRoles.TEACHER)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async create(
    @Body('name') name: string,
    @Body('description') description: string,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: AuthRequest,
  ): Promise<Course> {
    const teacher = await this.usersService.getById(req.user.id);
    const imagePath = this.filesService.saveFile(image);
    return this.coursesService.create({
      name,
      description,
      image: imagePath,
      teacher,
    });
  }

  @ApiOperation({ summary: 'Update course [Teacher]' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateCourseDto })
  @ApiOkResponse({ type: Course })
  @ApiNotFoundResponse({ description: 'Course not found' })
  @Roles(DefaultRoles.TEACHER)
  @UseGuards(RolesGuard, CourseAuthorGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Put(':courseId')
  async update(
    @Param('id') id: number,
    @Body('name') name?: string,
    @Body('description') description?: string,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<Course> {
    let imagePath = undefined;
    if (image) {
      imagePath = this.filesService.saveFile(image);
    }

    return this.coursesService.update(id, {
      name,
      description,
      image: imagePath,
    });
  }

  @ApiOperation({ summary: 'Delete course [Teacher]' })
  @ApiOkResponse()
  @Roles(DefaultRoles.TEACHER)
  @UseGuards(RolesGuard, CourseAuthorGuard)
  @Delete(':courseId')
  async delete(@Param('id') id: number): Promise<void> {
    await this.coursesService.delete(id);
  }
}
