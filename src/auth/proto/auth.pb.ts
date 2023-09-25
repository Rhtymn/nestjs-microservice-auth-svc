/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "auth";

/** Login */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: number;
  error: string[];
  token: string;
}

/** Register */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  status: number;
  error: string[];
}

/** ValidateToken */
export interface ValidateTokenRequest {
  token: string;
}

export interface ValidateTokenResponse {
  status: number;
  error: string[];
}

/** GetMe */
export interface GetMeRequest {
  token: string;
}

export interface GetMeResponse {
  status: number;
  error: string[];
  user: User | undefined;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export const AUTH_PACKAGE_NAME = "auth";

export interface AuthServiceClient {
  login(request: LoginRequest): Observable<LoginResponse>;

  register(request: RegisterRequest): Observable<RegisterResponse>;

  validateToken(request: ValidateTokenRequest): Observable<ValidateTokenResponse>;

  getMe(request: GetMeRequest): Observable<GetMeResponse>;
}

export interface AuthServiceController {
  login(request: LoginRequest): Promise<LoginResponse> | Observable<LoginResponse> | LoginResponse;

  register(request: RegisterRequest): Promise<RegisterResponse> | Observable<RegisterResponse> | RegisterResponse;

  validateToken(
    request: ValidateTokenRequest,
  ): Promise<ValidateTokenResponse> | Observable<ValidateTokenResponse> | ValidateTokenResponse;

  getMe(request: GetMeRequest): Promise<GetMeResponse> | Observable<GetMeResponse> | GetMeResponse;
}

export function AuthServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["login", "register", "validateToken", "getMe"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTH_SERVICE_NAME = "AuthService";
