import { ProductPresentation } from '../../domain/entities/product-presentation.entity';
import { Product } from '../../domain/entities/product.entity';
import { ProductWriteRepository } from '../../domain/repositories/product-write.repository';
import { CreateProductDto } from '../dtos/inputs/create-product.dto';
import { ImageStoragePort } from '../../../../core/common/storage/application/ports/image-storage.port';
import { ProductReadRepository } from '../ports/product-read.repository';
import { Barcode } from '../../domain/value-objects/bar-code.value-object';
import { CreatedProductDto } from '../dtos/outputs/created-product.dto';

export class CreateProductUseCase {
  constructor(
    private readonly productWriteRepository: ProductWriteRepository,
    private readonly productReadRepository: ProductReadRepository,
    private readonly imageStoragePort: ImageStoragePort,
  ) {}

  async execute(dto: CreateProductDto): Promise<CreatedProductDto> {
    const existingProduct = await this.productReadRepository.findByNameBrandCategory(
      dto.name,
      dto.brandId,
      dto.categoryId,
    );

    if (existingProduct) existingProduct.ensureCanAddPresentation(dto.presentation.value, dto.presentation.unit);

    const imageUri = await this.imageStoragePort.save(dto.presentation.imagePath);

    const barcode = new Barcode(
      dto.presentation.barcode.barcodeId,
      dto.presentation.barcode.code,
      dto.presentation.barcode.isActive ?? true,
    );

    const productId = existingProduct ? existingProduct.getId() : dto.productId;

    const presentation = new ProductPresentation(
      dto.presentation.presentationId,
      productId,
      imageUri,
      dto.presentation.value,
      dto.presentation.unit,
      dto.presentation.salePrice,
      barcode,
    );

    if (existingProduct) await this.productWriteRepository.addPresentation(presentation);
    
    if (!existingProduct) {
      const product = new Product(dto.productId, dto.categoryId, dto.brandId, dto.name);
      product.addPresentation(presentation);
      await this.productWriteRepository.save(product);
    }

    return {
      productId,
      productName: dto.name,
      brandId: dto.brandId,
      categoryId: dto.categoryId,
      presentation: {
        presentationId: presentation.getId(),
        barcode: Number(barcode.getCode()),
        imageUri: presentation.getImageUri(),
        value: presentation.getValue(),
        unit: presentation.getUnit(),
        salePrice: presentation.getSalePrice(),
      },
    };
  }
}