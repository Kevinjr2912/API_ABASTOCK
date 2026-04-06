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
import { GetCategoriesQueryHandler } from "./application/queries/handlers/get-categories.handler";
import { GetCategoriesUseCase } from "./application/usecases/get-categories.use-case";
import { GetBrandsQueryHandler } from "./application/queries/handlers/get-brands.handler";
import { GetBrandsUseCase } from "./application/usecases/get-brands.use-case";

@Module({
  imports: [StorageModule],
  providers: [
    // Handlers
    CreateProductCommandHandler,
    GetCategoriesQueryHandler,
    GetBrandsQueryHandler,

    // adapters
    CloudinaryProvider,
    { provide: 'ProductReadRepository', useClass: ProductReadRepositoryImpl },
    { provide: 'ProductWriteRepository', useClass: ProductWriteRepositoryImpl },

    // use cases
    {
      provide: CreateProductUseCase,
      useFactory: (
        productWriteRepository: ProductWriteRepository,
        productReadRepository: ProductReadRepository,
        imageStoragePort: ImageStoragePort,
      ) => new CreateProductUseCase(productWriteRepository, productReadRepository, imageStoragePort),
      inject: ['ProductWriteRepository', 'ProductReadRepository', 'ImageStoragePort'],
    },
    {
      provide: GetCategoriesUseCase,
      useFactory: (
        productReadRepository: ProductReadRepository
      ) => new GetCategoriesUseCase(productReadRepository),
      inject: ['ProductReadRepository'],
    },
    {
      provide: GetBrandsUseCase,
      useFactory: (
        productReadRepository: ProductReadRepository
      ) => new GetBrandsUseCase(productReadRepository),
      inject: ['ProductReadRepository'],
    }
  ],
  controllers: [ProductController]
})
export class ProductsModule {}
