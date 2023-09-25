export interface TokenPayload {
  id: string;
  name: string;
}

export interface DecodedToken {
  id: string;
  name: string;
  iat: number;
  exp: number;
}
