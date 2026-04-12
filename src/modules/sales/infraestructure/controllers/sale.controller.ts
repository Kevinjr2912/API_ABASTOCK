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
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Sales')
@Controller('sales')
export class SaleController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar una nueva venta' })
  @ApiResponse({ status: 201, description: 'La venta ha sido procesada y el inventario descontado.' })
  @ApiResponse({ status: 400, description: 'Estructura o payload inválido.' })
  @ApiResponse({ status: 422, description: 'No hay stock suficiente para procesar uno o más ítems.' })
  @ApiResponse({ status: 409, description: 'Conflicto de PK o venta duplicada.' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todas las ventas por tienda y fecha' })
  @ApiQuery({ name: 'storeId', description: 'ID UUID de la tienda', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @ApiQuery({ name: 'date', description: 'Día a consultar', example: '2026-04-11' })
  @ApiResponse({ 
    status: 200, 
    description: 'Devuelve un summary y un array de items vendidos.',
    schema: {
      example: {
        summary: { totalRevenue: 91.00, transactionCount: 1 },
        sales: [
          {
            saleId: "e593cc62-e4e8-4464-8738-174936a5705b",
            time: "13:30",
            totalAmount: 91.00,
            totalItems: 2,
            items: [
              { productName: "Coca Cola 600ml", quantity: 2, subtotal: 91.00 }
            ]
          }
        ]
      }
    }
  })
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
