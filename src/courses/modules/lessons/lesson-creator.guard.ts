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
import { LessonsService } from './lessons.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class LessonCreatorGuard implements CanActivate {
  constructor(
    @Inject(LessonsService) private readonly lessonsService: LessonsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<AuthRequest & { params: Record<string, any> }>();

    if (!req.user) {
      throw new UnauthorizedException('You are not logged in');
    }

    const lessonId = req.params?.id;

    if (!Number(lessonId)) {
      throw new BadRequestException('Lesson id is required');
    }

    const lesson = await this.lessonsService.getById(Number(lessonId));

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson.creator?.id === req.user.id;
  }
}
