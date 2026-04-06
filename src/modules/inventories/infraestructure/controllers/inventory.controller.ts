import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infraestructure/guards/jwt-auth.guard';
import { CreateInventoryRequestDto } from '../dtos/requests/create-inventory-request.dto';
import { CreateInventoryCommand } from '../../application/commands/create-inventory.command';
import { FindProductByBarcodeQuery } from '../../application/queries/find-product-by-barcode.query';
import { ListInventoryProductsQuery } from '../../application/queries/list-inventory-products.query';

@Controller('inventories')
export class InventoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateInventoryRequestDto) {
    return await this.commandBus.execute(
      new CreateInventoryCommand(
        dto.inventoryId,
        dto.storeId,
        dto.presentationId,
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('/scan')
  async scanByBarcode(
    @Param('storeId') storeId: string,
    @Param('barcode') barcode: string,
  ) {
    if (!storeId || !barcode) {
      throw new BadRequestException('storeId and barcode are required');
    }

    const product = await this.queryBus.execute(
      new FindProductByBarcodeQuery(storeId, barcode),
    );

    if (!product) {
      throw new BadRequestException('Product not found in this store');
    }

    return product;
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async listByStore(@Param('storeId') storeId: string) {
    if (!storeId) {
      throw new BadRequestException('storeId is required');
    }

    return this.queryBus.execute(new ListInventoryProductsQuery(storeId));
  }
}
