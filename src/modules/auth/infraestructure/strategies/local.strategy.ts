import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { ValidateUserUseCase } from '../../application/usecases/validate-user.use-case';
import { InvalidCredentialsError } from '../../application/errors/invalid-credentials.error';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly validateUserUseCase: ValidateUserUseCase
  ) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    const user = await this.validateUserUseCase.execute(email, password);
    if (!user) throw new InvalidCredentialsError();
    return user;
  }
}
