import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import Course from '@/entities/Course';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { UsersService } from '@/users/users.service';
import { GetCoursesResultDto } from '@/courses/dto/get-courses-result.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
    @Inject(UsersService)
    private readonly usersService: UsersService,
  ) {}

  async create(courseDto: CreateCourseDto): Promise<Course> {
    return await this.courseRepository.save(courseDto);
  }

  async update(id: number, courseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (courseDto.name) {
      course.name = courseDto.name;
    }

    if (courseDto.description) {
      course.description = courseDto.description;
    }

    if (courseDto.image) {
      course.image = courseDto.image;
    }

    return await this.courseRepository.save(course);
  }

  async delete(id: number): Promise<void> {
    await this.courseRepository.delete({ id });
  }

  async getById(id: number): Promise<Course | null> {
    return this.courseRepository.findOne({
      where: { id },
      relations: ['teacher'],
    });
  }

  async getAll(
    limit: number,
    page: number,
    query?: string,
  ): Promise<GetCoursesResultDto> {
    const where: FindOptionsWhere<Course> = {};

    if (query) {
      where.name = ILike(`%${query}%`);
    }

    const [courses, count] = await this.courseRepository.findAndCount({
      where,
      relations: ['teacher'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { count, courses };
  }
}
