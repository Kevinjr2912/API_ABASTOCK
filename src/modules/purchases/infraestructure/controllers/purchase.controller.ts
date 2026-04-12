import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infraestructure/guards/jwt-auth.guard';
import { CreatePurchaseCommand } from '../../application/commands/create-purchase.command';
import { CreatePurchaseRequestDto } from '../dtos/requests/create-purchase-request.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Purchases')
@Controller('purchases')
export class PurchaseController {
  constructor(private readonly commandBus: CommandBus) { }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Registrar una compra / surtido de mercancía' })
  @ApiResponse({ status: 201, description: 'La compra se guardó y el inventario aumentó correctamente.' })
  @ApiResponse({ status: 400, description: 'Faltan variables o tienen formato incorrecto.' })
  @ApiResponse({ status: 404, description: 'No se encontró el inventario o la tienda.' })
  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPurchase(@Body() dto: CreatePurchaseRequestDto) {
    await this.commandBus.execute(
      new CreatePurchaseCommand({
        purchaseId: dto.purchaseId,
        storeId: dto.storeId,
        purchaseDate: dto.purchaseDate,
        totalCost: dto.totalCost,
        purchaseItems: dto.purchaseItems.map(item => ({
          purchaseItemId: item.purchaseItemId,
          presentationId: item.presentationId,
          inventoryId: item.inventoryId,
          quantity: item.quantity,
          costPrice: item.costPrice,
          salePrice: item.salePrice,
        })),
      }),
    );

    return {
      message: 'Purchase created successfully',
    };
  }
}