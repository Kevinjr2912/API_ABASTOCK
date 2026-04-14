import type { DeviceTokenRepository } from '../ports/device-token.repository';

export class RegisterDeviceTokenUseCase {
  constructor(
    private readonly repository: DeviceTokenRepository,
  ) {}

  async execute(userId: string, token: string): Promise<void> {
    await this.repository.saveToken(userId, token);
  }
}
