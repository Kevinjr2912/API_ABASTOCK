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

@Controller('purchases')
export class PurchaseController {
  constructor(private readonly commandBus: CommandBus) { }

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