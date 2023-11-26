import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import Token from '@/entities/Token';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import User from '@/entities/User';
import { TokenPayloadDto } from './dto/token-payload.dto';
import { CreateTokenDto } from './dto/create-token.dto';
import { GeneratedTokenDto } from './dto/generated-token.dto';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private readonly jwtService: JwtService,
  ) {}

  async generate(tokenPayload: TokenPayloadDto): Promise<GeneratedTokenDto> {
    const refreshToken: string = await this.jwtService.signAsync(tokenPayload, {
      expiresIn: '30d',
    });

    const accessToken: string = await this.jwtService.signAsync(tokenPayload);

    return {
      accessToken,
      refreshToken,
    };
  }

  async createByUser(user: User): Promise<Token> {
    const tokenPayload: TokenPayloadDto = {
      id: user.id,
      login: user.login,
      roles: user.roles?.map(({ code }) => code) ?? [],
    };

    const { refreshToken, accessToken } = await this.generate(tokenPayload);

    const token: CreateTokenDto = {
      refreshToken,
      accessToken,
      user,
    };

    return await this.tokenRepository.save(token);
  }

  async getByRefreshToken(refreshToken: string) {
    return await this.tokenRepository.findOneBy({ refreshToken });
  }

  async refresh(token: Token) {
    const tokenPayload: TokenPayloadDto = await this.jwtService.decode(
      token.refreshToken,
    );
    const { refreshToken, accessToken } = await this.generate(tokenPayload);

    return await this.tokenRepository.save({
      ...token,
      refreshToken,
      accessToken,
    });
  }

  check(token): TokenPayloadDto | null {
    try {
      return this.jwtService.verify(token);
    } catch (error) {
      return null;
    }
  }
}
