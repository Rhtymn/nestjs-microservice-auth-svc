import { Injectable, Inject } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService as Jwt } from '@nestjs/jwt';
import { DecodedToken, TokenPayload } from 'src/types';

@Injectable()
export class JwtService {
  @Inject()
  private readonly jwt: Jwt;

  public async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return bcrypt.hash(password, salt);
  }

  public async comparePassword(
    password: string,
    userPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(password, userPassword);
  }

  public async generateToken(payload: TokenPayload): Promise<string> {
    return this.jwt.sign(payload);
  }

  public async verifyToken(token: string): Promise<boolean> {
    try {
      this.jwt.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }

  public async decodeToken(token: string): Promise<DecodedToken> {
    return this.jwt.decode(token) as DecodedToken;
  }
}
