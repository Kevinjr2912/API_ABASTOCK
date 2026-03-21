import { Module } from '@nestjs/common';
import { AuthController } from './infraestructure/controllers/auth.controller';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './infraestructure/strategies/local.strategy';
import { JwtStrategy } from './infraestructure/strategies/jwt.strategy';
import { SignUpUseCase } from './application/usecases/sign-up.use-case';
import { ValidateUserUseCase } from './application/usecases/validate-user.use-case';
import { BcryptAdapter } from './infraestructure/adapters/bcrypt.adapter';
import { SignUpCommandHandler } from './application/commands/handlers/sign-up.handler';
import { CqrsModule } from '@nestjs/cqrs';
import { UserWriteRepository } from '../users/domain/repositories/user-write.repository';
import { UserReadRepository } from '../users/application/ports/user-read.repository';
import { HashPort } from './application/ports/hash.port';
import { SessionWriteRepositoryImpl } from './infraestructure/adapters/session-write.adapter';
import { JwtAdapter } from './infraestructure/adapters/jwt.adapter';
import { SignInUseCase } from './application/usecases/sign-in.use-case';
import { TokenPort } from './application/ports/token.port';
import { GeneratorUUIDAdapter } from './infraestructure/adapters/generator-uuid.adapter';
import { GeneratorUUIDPort } from './application/ports/generator-uuid.port';
import { SignInCommandHandler } from './application/commands/handlers/sign-in.handler';
import { SessionWriteRepository } from './domain/repositories/session-write.repository';
import { RefreshTokenCommandHandler } from './application/commands/handlers/refresh-token.handler';
import { SessionReadRepositoryImpl } from './infraestructure/adapters/session-read.adapter';
import { RefreshTokenUseCase } from './application/usecases/refresh-token.use-case';
import { SessionReadRepository } from './application/ports/session-read.repository';
import { SessionCleanupJob } from './infraestructure/jobs/session-cleanup.job';
import { SignOutCommandHandler } from './application/commands/handlers/sign-out.handler';
import { SignOutUseCase } from './application/usecases/sign-out.use-case';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    CqrsModule,
    JwtModule.register({}),
  ],
  providers: [
    // Strategies
    LocalStrategy,
    JwtStrategy,

    // Command handlers 
    SignUpCommandHandler,
    SignInCommandHandler, 
    RefreshTokenCommandHandler,
    SignOutCommandHandler,

    // Adapters
    { provide: 'HashPort',                useClass: BcryptAdapter },
    { provide: 'TokenPort',               useClass: JwtAdapter },
    { provide: 'GeneratorUUIDPort',       useClass: GeneratorUUIDAdapter },
    { provide: 'SessionWriteRepository',  useClass: SessionWriteRepositoryImpl },
    { provide: 'SessionReadRepository', useClass: SessionReadRepositoryImpl },

    // Use cases
    {
      provide: SignUpUseCase,
      useFactory: (
        userWriteRepo: UserWriteRepository,
        userReadRepo: UserReadRepository,
        hashPort: HashPort,
      ) => new SignUpUseCase(userWriteRepo, userReadRepo, hashPort),
      inject: ['UserWriteRepository', 'UserReadRepository', 'HashPort'],
    },
    {
      provide: SignInUseCase,
      useFactory: (
        tokenPort: TokenPort,
        hashPort: HashPort,
        generatorUUIDPort: GeneratorUUIDPort,
        sessionRepository: SessionWriteRepository,
      ) => new SignInUseCase(tokenPort, hashPort, generatorUUIDPort, sessionRepository),
      inject: ['TokenPort', 'HashPort', 'GeneratorUUIDPort', 'SessionWriteRepository'],
    },
    {
      provide: ValidateUserUseCase,
      useFactory: (
        userReadRepository: UserReadRepository,
        hashPort: HashPort,
      ) => new ValidateUserUseCase(userReadRepository, hashPort),
      inject: ['UserReadRepository', 'HashPort'],
    },
    {
      provide: RefreshTokenUseCase,
      useFactory: (
        tokenPort: TokenPort,
        hashPort: HashPort,
        sessionReadRepository: SessionReadRepository,
        sessionWriteRepository: SessionWriteRepository,
      ) => new RefreshTokenUseCase(tokenPort, hashPort, sessionReadRepository, sessionWriteRepository),
      inject: ['TokenPort', 'HashPort', 'SessionReadRepository', 'SessionWriteRepository'],
    },
    {
      provide: SignOutUseCase,
      useFactory: (
        sessionReadRepository: SessionReadRepository,
        sessionWriteRepository: SessionWriteRepository,
      ) => new SignOutUseCase(sessionReadRepository, sessionWriteRepository),
      inject: ['SessionReadRepository', 'SessionWriteRepository'],
    },

    // Jobs
    SessionCleanupJob
  ],
  controllers: [AuthController],
})
export class AuthModule {}