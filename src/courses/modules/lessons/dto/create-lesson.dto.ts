import Course from '@/entities/Course';
import User from '@/entities/User';

export class CreateLessonDto {
  readonly name: string;
  readonly date: number;
  readonly course: Course;
  readonly creator: User;
}
