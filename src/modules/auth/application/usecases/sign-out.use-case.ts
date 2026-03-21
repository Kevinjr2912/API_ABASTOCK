import { SessionReadRepository } from '../ports/session-read.repository';
import { SessionWriteRepository } from '../../domain/repositories/session-write.repository';
import { SessionNotFoundError } from '../errors/session-not-found.error';
import { SessionInvalidError } from '../errors/session-invalid.error';
import { UserSession } from '../../domain/entities/user-session.entity';

export class SignOutUseCase {
  constructor(
    private readonly sessionReadRepository: SessionReadRepository,
    private readonly sessionWriteRepository: SessionWriteRepository,
  ) {}

  async execute(sessionId: string): Promise<void> {
    const session = await this.sessionReadRepository.findById(sessionId);
    this.assertSessionExists(session);
    this.assertSessionNotAlreadyRevoked(session!);
    await this.revokeAndSave(session!);
  }

  private assertSessionExists(session: UserSession | null): void {
    if (!session) throw new SessionNotFoundError();
  }

  private assertSessionNotAlreadyRevoked(session: UserSession): void {
    if (session.isRevoked()) throw new SessionInvalidError();
  }

  private async revokeAndSave(session: UserSession): Promise<void> {
    session.revoke();
    await this.sessionWriteRepository.save(session);
  }
}