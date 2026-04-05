import { Module } from "@nestjs/common";
import { ProductReadRepositoryImpl } from "./infraestructure/adapters/product-read.adapter";
import { ProductWriteRepositoryImpl } from "./infraestructure/adapters/product-write.adapter";
import { CreateProductUseCase } from "./application/usecases/create-product.use-case";
import { ProductWriteRepository } from "./domain/repositories/product-write.repository";
import { ProductReadRepository } from "./application/ports/product-read.repository";
import { StorageModule } from "../../core/common/storage/storage.module";
import { CloudinaryProvider } from "../../core/common/storage/infraestructure/providers/cloudinary.provider";
import { ImageStoragePort } from "../../core/common/storage/application/ports/image-storage.port";
import { ProductController } from "./infraestructure/controllers/product.controller";
import { CreateProductCommandHandler } from "./application/commands/handlers/create-product.handler";

@Module({
  imports: [StorageModule],
  providers: [
    // Handlers
    CreateProductCommandHandler,

    // adapters
    CloudinaryProvider,
    { provide: 'ProductReadRepository', useClass: ProductReadRepositoryImpl },
    { provide: 'ProductWriteRepository', useClass: ProductWriteRepositoryImpl },

    // casos de uso
    {
      provide: CreateProductUseCase,
      useFactory: (
        productWriteRepository: ProductWriteRepository,
        productReadRepository: ProductReadRepository,
        imageStoragePort: ImageStoragePort,
      ) => new CreateProductUseCase(productWriteRepository, productReadRepository, imageStoragePort),
      inject: ['ProductWriteRepository', 'ProductReadRepository', 'ImageStoragePort'],
    },
  ],
  controllers: [ProductController]
})
export class ProductsModule {}
