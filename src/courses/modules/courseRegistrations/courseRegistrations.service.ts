import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';

import {
  User,
  Course,
  CourseRegistration,
  CourseRegistrationRequest,
} from '@/entities';
import { CourseRegistrationRequestStatuses } from './types/CourseRegistrationRequestStatuses';

@Injectable()
export class CourseRegistrationsService {
  constructor(
    @InjectRepository(CourseRegistration)
    private readonly courseRegistrationRepository: Repository<CourseRegistration>,
    @InjectRepository(CourseRegistrationRequest)
    private readonly courseRegistrationRequestRepository: Repository<CourseRegistrationRequest>,
  ) {}

  async unregisterUserForCourse(
    courseId: number,
    userId: number,
  ): Promise<void> {
    await this.courseRegistrationRepository.delete({
      course: { id: courseId },
      user: { id: userId },
    });
  }

  async getRegisteredUsers(
    courseId: number,
    limit: number,
    page: number,
    query?: string,
  ): Promise<User[]> {
    const usersWhere: FindOptionsWhere<User> = {};

    if (query) {
      usersWhere.fullName = ILike(`%${query}%`);
    }

    const courseRegistrations = await this.courseRegistrationRepository.find({
      where: {
        user: usersWhere,
      },
      relations: ['user'],
      skip: (page - 1) * limit,
      take: limit,
    });

    return courseRegistrations.map(({ user }) => user);
  }

  async checkUserIsRegistered(
    courseId: number,
    userId: number,
  ): Promise<boolean> {
    const courseRegistration = await this.courseRegistrationRepository.findOne({
      where: {
        course: {
          id: courseId,
        },
        user: {
          id: userId,
        },
      },
    });

    return Boolean(courseRegistration);
  }

  async getRequestById(
    courseRegistrationId: number,
  ): Promise<CourseRegistrationRequest | null> {
    return this.courseRegistrationRequestRepository.findOne({
      where: {
        id: courseRegistrationId,
      },
      relations: ['user', 'course'],
    });
  }

  async getRequestByUserAndCourseId(
    courseId: number,
    userId: number,
  ): Promise<CourseRegistrationRequest | null> {
    return await this.courseRegistrationRequestRepository.findOne({
      where: {
        course: {
          id: courseId,
        },
        user: {
          id: userId,
        },
      },
      relations: ['user', 'course'],
    });
  }

  async createRequest(
    course: Course,
    user: User,
  ): Promise<CourseRegistrationRequest> {
    return await this.courseRegistrationRequestRepository.save({
      course,
      user,
    });
  }

  async accessRequest(
    courseRegistrationId: number,
  ): Promise<CourseRegistration | null> {
    const courseRegistrationRequest =
      await this.getRequestById(courseRegistrationId);

    if (!courseRegistrationRequest) {
      return null;
    }

    await this.courseRegistrationRequestRepository.save({
      ...courseRegistrationRequest,
      status: CourseRegistrationRequestStatuses.ACCESS,
    });

    return await this.courseRegistrationRepository.save({
      course: courseRegistrationRequest.course,
      user: courseRegistrationRequest.user,
    });
  }

  async rejectRequest(
    courseRegistrationId: number,
  ): Promise<CourseRegistration | null> {
    const courseRegistrationRequest =
      await this.getRequestById(courseRegistrationId);

    if (!courseRegistrationRequest) {
      return null;
    }

    await this.courseRegistrationRequestRepository.save({
      ...courseRegistrationRequest,
      status: CourseRegistrationRequestStatuses.REJECT,
    });
  }
}
