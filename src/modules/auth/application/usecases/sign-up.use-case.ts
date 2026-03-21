import type { UserWriteRepository } from 'src/modules/users/domain/repositories/user-write.repository';
import type { UserReadRepository } from 'src/modules/users/application/ports/user-read.repository';
import type { HashPort } from '../ports/hash.port';
import { User } from 'src/modules/users/domain/entities/User';
import { SignUpDto } from '../dtos/input/SignUp.dto';
import { EmailAlreadyTakenError } from '../errors/email-already-taken.error';

export class SignUpUseCase {
  constructor(
    private readonly userWriteRepository: UserWriteRepository,
    private readonly userReadRepository: UserReadRepository,
    private readonly hashPort: HashPort,
  ) {}

  async execute(dto: SignUpDto): Promise<void> {
    await this.ensureEmailIsAvailable(dto.email);
    const user = await this.buildUser(dto);
    await this.userWriteRepository.save(user);
  }

  private async ensureEmailIsAvailable(email: string): Promise<void> {
    const isTaken = await this.userReadRepository.existsByEmail(email);
    if (isTaken) throw new EmailAlreadyTakenError(email);
  }

  private async buildUser(dto: SignUpDto): Promise<User> {
    const hashedPassword = await this.hashPort.hash(dto.password);
    return new User(
      dto.id,
      dto.firstName,
      dto.middleName,
      dto.firstSurname,
      dto.secondLastName,
      dto.phoneNumber,
      dto.email,
      hashedPassword,
    );
  }
}
