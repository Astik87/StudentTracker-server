import { TokenPayloadDto } from '../dto/token-payload.dto';

export type AuthRequest = Request & { user: TokenPayloadDto };
