import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './core/database/database.module';
import appConfig from './core/config/app.config';
import databaseConfig from './core/config/database.config';
import cloudinaryConfig from './core/config/cloudinary.config';
import authConfig from './core/config/auth.config';
import joiValidation from './core/config/validation/joi.validation';

import { PostgreSQl } from './core/database/PostgreSQL';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.development.env',
      load: [
        appConfig, 
        databaseConfig, 
        authConfig,
        cloudinaryConfig
      ],
      validationSchema: joiValidation
    }),
    CqrsModule.forRoot(),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule
  ],
  controllers: [],
  providers: [PostgreSQl],
})
export class AppModule {}
