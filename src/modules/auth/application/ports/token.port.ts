export interface TokenPort {
  generateAccessToken(payload: any): Promise<string>;
  generateRefreshToken(payload: any): Promise<string>;
  generateRefreshTokenWithExpiration(payload: any, expiresInMs: number): Promise<string>;
  verifyRefreshToken(token: string): Promise<{ 
    sub: string; 
    name: string; 
    email: string; 
    sessionId: string 
  }>
}