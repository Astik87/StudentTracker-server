import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from '../../users.service';
import { RegisterByLoginDto } from './dto/register-by-login.dto';
import Token from '@/entities/Token';
import { TokenService } from './token.service';
import * as bcrypt from 'bcrypt';
import User from '@/entities/User';
import { TokenPayloadDto } from './dto/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  async registerByLogin(user: RegisterByLoginDto): Promise<User> {
    const candidate = await this.usersService.getByLogin(user.login);

    if (candidate) {
      throw new BadRequestException('A user with this login already exists');
    }

    const newUser = await this.usersService.create(user);

    return await this.usersService.setRoles(newUser.id, [user.role]);
  }

  async authByLogin(login: string, password: string): Promise<Token> {
    const user = await this.usersService.getByLogin(login);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const passwordIsValid: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordIsValid) {
      throw new BadRequestException('Incorrect password');
    }

    return await this.tokenService.createByUser(user);
  }

  async refresh(refreshToken: string) {
    const tokenPayload = await this.tokenService.check(refreshToken);

    if (!tokenPayload) {
      throw new BadRequestException('Invalid token');
    }

    const user = this.usersService.getById(tokenPayload.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = await this.tokenService.getByRefreshToken(refreshToken);

    if (!token) {
      throw new NotFoundException('Token not found');
    }

    return this.tokenService.refresh(token);
  }

  checkUserIsAuth(req: Request): TokenPayloadDto | null {
    const authHeader: string = req.headers['authorization'];

    if (!authHeader) {
      return null;
    }

    const authType: 'Bearer' | string = authHeader.split(' ')[0];
    const token: string = authHeader.split(' ')[1];

    if (authType !== 'Bearer' || !token) {
      return null;
    }

    return this.tokenService.check(token);
  }
}
