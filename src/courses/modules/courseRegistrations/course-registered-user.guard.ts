import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthRequest } from '@/users';
import { CourseRegistrationsService } from './courseRegistrations.service';

@Injectable()
export class CourseRegisteredUserGuard implements CanActivate {
  constructor(
    @Inject(CourseRegistrationsService)
    private readonly courseRegistrationsService: CourseRegistrationsService,
  ) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context
      .switchToHttp()
      .getRequest<AuthRequest & { params: { courseId?: string } }>();

    const { user } = req;

    if (!user) {
      throw new UnauthorizedException('You are not logged in');
    }

    const courseId = req.params.courseId;

    if (!Number(courseId)) {
      throw new BadRequestException('CourseId is required');
    }

    return this.courseRegistrationsService.checkUserIsRegistered(
      Number(courseId),
      user.id,
    );
  }
}
