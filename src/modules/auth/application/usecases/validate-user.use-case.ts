import type { UserReadRepository } from 'src/modules/users/application/ports/user-read.repository';
import type { HashPort } from '../ports/hash.port';
import { User } from 'src/modules/users/domain/entities/User';

export class ValidateUserUseCase {
  constructor(
    private readonly userReadRepository: UserReadRepository,
    private readonly hashPort: HashPort,
  ) {}

  async execute(email: string, password: string): Promise<User | null> {
    const user = await this.userReadRepository.findByEmail(email);
    if (!user) return null;

    const isValid = await this.hashPort.compare(password, user.getPassword());
    if (!isValid) return null;

    return user;
  }
}