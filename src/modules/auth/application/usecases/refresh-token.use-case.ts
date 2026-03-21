import { TokenPort } from '../ports/token.port';
import { HashPort } from '../ports/hash.port';
import { SessionReadRepository } from '../ports/session-read.repository';
import { SessionWriteRepository } from '../../domain/repositories/session-write.repository';
import { UserSession } from '../../domain/entities/user-session.entity';
import { SessionInvalidError } from '../errors/session-invalid.error';
import { SessionExpiredError } from '../errors/session-expired.error';

export class RefreshTokenUseCase {
  constructor(
    private readonly tokenPort: TokenPort,
    private readonly hashPort: HashPort,
    private readonly sessionReadRepository: SessionReadRepository,
    private readonly sessionWriteRepository: SessionWriteRepository,
  ) {}

  async execute(refreshToken: string) {
    const payload = await this.tokenPort.verifyRefreshToken(refreshToken);
    const session = await this.findAndValidateSession(payload.sessionId, refreshToken);
    return this.rotateTokens(session, payload);
  }

  private async findAndValidateSession(sessionId: string, refreshToken: string): Promise<UserSession> {
    const session = await this.sessionReadRepository.findById(sessionId);
    await this.assertSessionIsActive(session);
    if (!session) throw new SessionInvalidError();
    await this.assertSessionNotExpired(session);
    await this.assertTokenMatchesSession(refreshToken, session);

    return session;
  }

  private async assertSessionIsActive(session: UserSession | null): Promise<void> {
    if (!session || session.isRevoked()) {
      if (session) await this.revokeAndSave(session);
      throw new SessionInvalidError();
    }
  }

  private async assertSessionNotExpired(session: UserSession): Promise<void> {
    if (new Date() > session.getExpiresAt()) {
      await this.revokeAndSave(session);
      throw new SessionExpiredError();
    }
  }

  private async assertTokenMatchesSession(refreshToken: string, session: UserSession): Promise<void> {
    const isValid = await this.hashPort.compare(refreshToken, session.getRefreshToken());
    if (!isValid) {
      await this.revokeAndSave(session);
      throw new SessionInvalidError();
    }
  }

  private async rotateTokens(session: UserSession, payload: Record<string, any>) {
    const newPayload = {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      sessionId: payload.sessionId,
    };

    const msUntilExpires = session.getExpiresAt().getTime() - Date.now();

    const [newAccessToken, newRefreshToken] = await Promise.all([
      this.tokenPort.generateAccessToken(newPayload),
      this.tokenPort.generateRefreshTokenWithExpiration(newPayload, msUntilExpires),
    ]);

    session.updateRefreshToken(await this.hashPort.hash(newRefreshToken));
    await this.sessionWriteRepository.save(session);

    return { access_token: newAccessToken, refresh_token: newRefreshToken };
  }

  private async revokeAndSave(session: UserSession): Promise<void> {
    session.revoke();
    await this.sessionWriteRepository.save(session);
  }
}