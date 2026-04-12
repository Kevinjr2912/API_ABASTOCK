import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Query,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/modules/auth/infraestructure/guards/jwt-auth.guard';
import { CreateInventoryRequestDto } from '../dtos/requests/create-inventory-request.dto';
import { CreateInventoryCommand } from '../../application/commands/create-inventory.command';
import { FindProductByBarcodeQuery } from '../../application/queries/find-product-by-barcode.query';
import { ListInventoryProductsQuery } from '../../application/queries/list-inventory-products.query';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

@ApiTags('Inventories')
@Controller('inventories')
export class InventoryController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus
  ) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Asociar una nueva presentación de producto a la tienda (Stock: 0)' })
  @ApiResponse({ status: 201, description: 'Inventario inicializado correctamente en cero.' })
  @ApiResponse({ status: 409, description: 'Ya existe un inventario para esa presentación.' })
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Escanear código de barras para venta (Ventanilla)' })
  @ApiQuery({ name: 'storeId', description: 'ID de la tienda local', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @ApiQuery({ name: 'barcode', description: 'Código de barras de la pistola escáner', example: '7501055310883' })
  @ApiResponse({ status: 200, description: 'Retorna datos del producto, presentación y current stock asociado.' })
  @ApiResponse({ status: 404, description: 'Producto no encontrado por código de barras.' })
  @UseGuards(JwtAuthGuard)
  @Get('/scan')
  async scanByBarcode(
    @Query('storeId') storeId: string,
    @Query('barcode') barcode: string,
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

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar todo el inventario de la tienda' })
  @ApiQuery({ name: 'storeId', description: 'ID de la tienda', example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @ApiResponse({ status: 200, description: 'Retorna array completo del stock físico actual.' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async listByStore(@Query('storeId') storeId: string) {
    if (!storeId) {
      throw new BadRequestException('storeId is required');
    }

    return this.queryBus.execute(new ListInventoryProductsQuery(storeId));
  }
}
