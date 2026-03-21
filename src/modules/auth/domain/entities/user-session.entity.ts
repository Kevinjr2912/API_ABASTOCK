export class UserSession {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private refreshToken: string,
    private revoked: boolean,
    private readonly expiresAt: Date,
  ) {}

  getId() { return this.id }
  getUserId() { return this.userId }
  getRefreshToken() { return this.refreshToken }
  isRevoked() { return this.revoked }
  getExpiresAt() { return this.expiresAt }

  revoke() {
    this.revoked = true;
  }

  updateRefreshToken(tokenHash: string) {
    this.refreshToken = tokenHash;
  }
}