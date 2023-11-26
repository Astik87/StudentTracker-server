import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../../users.module';
import { TokenService } from './token.service';
import Token from '@/entities/Token';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'secret',
      signOptions: { expiresIn: '15m' },
    }),
    TypeOrmModule.forFeature([Token]),
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService, TokenService],
  controllers: [AuthController],
  exports: [AuthService, TokenService],
})
export class AuthModule {}
