export interface DeviceTokenRepository {
  saveToken(userId: string, token: string): Promise<void>;
  getTokensByUserId(userId: string): Promise<string[]>;
  getAllActiveTokens(): Promise<{ userId: string; token: string }[]>;
}
