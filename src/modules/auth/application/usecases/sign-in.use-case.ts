import { UserSession } from '../../domain/entities/user-session.entity';
import { SessionWriteRepository } from '../../domain/repositories/session-write.repository';
import { GeneratorUUIDPort } from '../ports/generator-uuid.port';
import { HashPort } from '../ports/hash.port';
import { TokenPort } from '../ports/token.port';

export class SignInUseCase {
  constructor(
    private readonly tokenPort: TokenPort,
    private readonly hashPort: HashPort,
    private readonly generatorUUIDPort: GeneratorUUIDPort,
    private readonly sessionRepository: SessionWriteRepository,
  ) {}

  async execute(user: { id: string; name: string; email: string }) {
    const sessionId = this.generatorUUIDPort.generate()

    const payload = {
      sub: user.id,
      name: user.name,
      email: user.email,
      sessionId: sessionId
    };

    const accessToken = await this.tokenPort.generateAccessToken(payload);
    const refreshToken = await this.tokenPort.generateRefreshToken(payload);
    const hashedRefreshToken = await this.hashPort.hash(refreshToken);

    const session = new UserSession(
      sessionId,
      user.id,
      hashedRefreshToken,
      false,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    );

    await this.sessionRepository.save(session);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}
