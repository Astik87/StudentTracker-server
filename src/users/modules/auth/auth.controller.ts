import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiExtension,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { UsersService } from '@/users';
import { Token, User } from '@/entities';
import { AuthService } from './auth.service';
import { RegisterByLoginDto } from './dto/register-by-login.dto';
import { AuthByLoginDto } from './dto/auth-by-login.dto';

@Controller('users/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiTags('Authorisation')
  @ApiOperation({ summary: 'Auth by login' })
  @ApiResponse({ status: 200, type: Token })
  @ApiNotFoundResponse({ description: 'User not found' })
  @ApiBadRequestResponse({ description: 'Incorrect password' })
  @Post('by-login')
  async authByLogin(
    @Body() { login, password }: AuthByLoginDto,
  ): Promise<Token> {
    return this.authService.authByLogin(login, password);
  }

  @ApiTags('Registration')
  @ApiOperation({ summary: 'Register by login' })
  @ApiResponse({ status: 200, type: User })
  @ApiBadRequestResponse({
    description: 'A user with this login already exists',
  })
  @Post('register/by-login')
  async registerByLogin(@Body() user: RegisterByLoginDto): Promise<User> {
    return this.authService.registerByLogin(user);
  }
}
