import User from '@/entities/User';

export class CreateTokenDto {
  readonly refreshToken: string;
  readonly accessToken: string;
  readonly user: User;
}
