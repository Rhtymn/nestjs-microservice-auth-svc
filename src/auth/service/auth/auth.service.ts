import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import {
  GetMeRequest,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '../../proto/auth.pb';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entity/user.entity';
import { JwtService } from '../jwt/jwt.service';
import { JWT_SERVICE } from 'src/auth/auth.constant';
import { DecodedToken } from 'src/types';

@Injectable()
export class AuthService {
  @InjectRepository(User) private readonly userRepository: Repository<User>;
  @Inject(JWT_SERVICE) private readonly jwtService: JwtService;

  public async login(request: LoginRequest): Promise<LoginResponse> {
    // Check if user exists
    const user = await this.userRepository.findOneBy({ email: request.email });

    if (!user) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid email or password'],
        token: null,
      };
    }

    // Check if password is correct
    const isPasswordCorrect = await this.jwtService.comparePassword(
      request.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid email or password'],
        token: null,
      };
    }

    // Generate token
    const token = await this.jwtService.generateToken({
      id: user.id,
      name: user.name,
    });

    return {
      status: HttpStatus.OK,
      error: null,
      token: token,
    };
  }

  public async register(request: RegisterRequest): Promise<RegisterResponse> {
    // Check if user exists
    const user = await this.userRepository.findOneBy({ email: request.email });

    if (user) {
      return {
        status: HttpStatus.CONFLICT,
        error: ['User already exists'],
      };
    }

    // If user not exist, create user
    const newUser = new User();
    newUser.email = request.email;
    newUser.password = await this.jwtService.hashPassword(request.password);
    newUser.name = request.name;

    // Save user
    await this.userRepository.save(newUser);

    return {
      status: HttpStatus.CREATED,
      error: null,
    };
  }

  public async validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> {
    const isValidToken = await this.jwtService.verifyToken(request.token);

    if (!isValidToken) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid token'],
      };
    }

    return {
      status: HttpStatus.OK,
      error: null,
    };
  }

  public async getMe(request: GetMeRequest): Promise<GetMeResponse> {
    const isValidToken = await this.jwtService.verifyToken(request.token);

    if (!isValidToken) {
      return {
        status: HttpStatus.UNAUTHORIZED,
        error: ['Invalid token'],
        user: undefined,
      };
    }

    const decodedToken: DecodedToken = await this.jwtService.decodeToken(
      request.token,
    );

    const user: User = await this.userRepository.findOne({
      where: { id: decodedToken.id },
      select: { email: true },
    });

    return {
      status: HttpStatus.OK,
      error: null,
      user: {
        id: decodedToken.id,
        name: decodedToken.name,
        email: user.email,
      },
    };
  }
}
