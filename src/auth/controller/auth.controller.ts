import { Controller, Inject } from '@nestjs/common';
import {
  AuthServiceController,
  AuthServiceControllerMethods,
  GetMeRequest,
  GetMeResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ValidateTokenRequest,
  ValidateTokenResponse,
} from '../proto/auth.pb';
import { Observable } from 'rxjs';
import { AuthService } from '../service/auth/auth.service';
import { AUTH_SERVICE } from '../auth.constant';

@Controller('auth')
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  login(
    request: LoginRequest,
  ): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse {
    return this.authService.login(request);
  }

  register(
    request: RegisterRequest,
  ):
    | Promise<RegisterResponse>
    | Observable<RegisterResponse>
    | RegisterResponse {
    return this.authService.register(request);
  }

  validateToken(
    request: ValidateTokenRequest,
  ):
    | Promise<ValidateTokenResponse>
    | Observable<ValidateTokenResponse>
    | ValidateTokenResponse {
    return this.authService.validateToken(request);
  }

  getMe(
    request: GetMeRequest,
  ): Promise<GetMeResponse> | Observable<GetMeResponse> | GetMeResponse {
    return this.authService.getMe(request);
  }
}
