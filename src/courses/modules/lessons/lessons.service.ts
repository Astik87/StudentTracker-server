import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import Lesson from '@/entities/Lesson';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CoursesService } from '../../courses.service';
import { GetLessonsDto } from '@/courses/modules/lessons/dto/get-lessons.dto';

@Injectable()
export class LessonsService {
  constructor(
    @InjectRepository(Lesson)
    private readonly lessonRepository: Repository<Lesson>,
    @Inject(CoursesService) private readonly coursesService: CoursesService,
  ) {}

  async getById(id: number): Promise<Lesson | null> {
    return this.lessonRepository.findOne({
      where: { id },
      relations: ['creator', 'course'],
    });
  }

  async getAllByCourseId(
    courseId: number,
    limit: number,
    page: number,
    query?: string,
  ): Promise<GetLessonsDto> {
    const course = await this.coursesService.getById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const where: FindOptionsWhere<Lesson> = { course: { id: courseId } };

    if (query) {
      where.name = query;
    }

    const [lessons, count] = await this.lessonRepository.findAndCount({
      where,
      relations: ['creator', 'course'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return { count, lessons };
  }

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonRepository.save({
      ...createLessonDto,
      date: new Date(createLessonDto.date),
    });
  }

  async update(
    id: number,
    updateLessonDto: UpdateLessonDto,
  ): Promise<Lesson | null> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['creator', 'course'],
    });

    if (!lesson) {
      return null;
    }

    if (updateLessonDto.name) {
      lesson.name = updateLessonDto.name;
    }

    if (updateLessonDto.date) {
      lesson.date = new Date(updateLessonDto.date);
    }

    return this.lessonRepository.save(lesson);
  }

  async delete(id: number): Promise<void> {
    await this.lessonRepository.delete({ id });
  }
}
