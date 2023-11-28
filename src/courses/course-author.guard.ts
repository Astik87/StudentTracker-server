import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthRequest } from '@/users';
import { CoursesService } from './courses.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class CourseAuthorGuard implements CanActivate {
  constructor(
    @Inject(CoursesService) private readonly coursesService: CoursesService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<AuthRequest & { params: Record<string, any> }>();

    if (!req.user) {
      throw new UnauthorizedException('You are not logged in');
    }

    const courseId = req.params.courseId;

    if (!Number(courseId)) {
      throw new BadRequestException('Course id is required');
    }

    const course = await this.coursesService.getById(Number(courseId));

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course.teacher?.id === req.user.id;
  }
}
