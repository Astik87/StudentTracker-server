import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import Lesson from '@/entities/Lesson';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { CoursesService } from '../../courses.service';

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
  ): Promise<Lesson[]> {
    const course = await this.coursesService.getById(courseId);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    const where: FindOptionsWhere<Lesson> = { course: { id: courseId } };

    if (query) {
      where.name = query;
    }

    return this.lessonRepository.find({
      where,
      relations: ['creator', 'course'],
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async create(createLessonDto: CreateLessonDto): Promise<Lesson> {
    return this.lessonRepository.save({
      ...createLessonDto,
      date: new Date(createLessonDto.date),
    });
  }

  async update(id: number, updateLessonDto: UpdateLessonDto): Promise<Lesson> {
    const lesson = await this.lessonRepository.findOne({
      where: { id },
      relations: ['creator', 'course'],
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
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
