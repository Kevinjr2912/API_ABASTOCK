import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
  BadRequestException
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infraestructure/guards/jwt-auth.guard';
import { CreateSaleCommand } from '../../application/commands/create-sale.command';
import { CreateSaleRequestDto } from '../dtos/requests/create-sale-request.dto';
import { GetSalesByDateQuery } from '../../application/queries/get-sales-by-date.query';

@Controller('sales')
export class SaleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSale(@Body() dto: CreateSaleRequestDto) {
    await this.commandBus.execute(
      new CreateSaleCommand({
        saleId: dto.saleId,
        storeId: dto.storeId,
        saleDate: dto.saleDate,
        totalAmount: dto.totalAmount,
        saleItems: dto.saleItems.map(item => ({
          saleItemId: item.saleItemId,
          presentationId: item.presentationId,
          inventoryId: item.inventoryId,
          quantity: item.quantity,
          salePrice: item.salePrice,
          subtotal: item.subtotal,
        })),
      }),
    );

    return {
      message: 'Sale created successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getSalesByDate(
    @Query('storeId') storeId: string,
    @Query('date') dateString: string,
  ) {
    if (!storeId || !dateString) {
      throw new BadRequestException('storeId and date are required query parameters');
    }

    return this.queryBus.execute(new GetSalesByDateQuery(storeId, dateString));
  }
}
