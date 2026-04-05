import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateStoreRequestDto } from '../dtos/requests/CreateStoreRequestDto';
import { CreateStoreCommand } from '../../application/commands/create-store.command';
import { JwtAuthGuard } from '../../../auth/infraestructure/guards/jwt-auth.guard';

@Controller('stores')
export class StoreController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createStore(@Body() dto: CreateStoreRequestDto) {
    await this.commandBus.execute( new CreateStoreCommand(dto.storeId, dto.userId, dto.name) );

    return {
      message: 'Store created successfully',
    };
  }
}
