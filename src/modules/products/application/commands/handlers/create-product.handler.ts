import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateProductCommand } from "../create-product.command";
import { CreateProductUseCase } from "../../usecases/create-product.use-case";

@CommandHandler(CreateProductCommand)
export class CreateProductCommandHandler implements ICommandHandler<CreateProductCommand, void> {

  constructor (private readonly createProductUseCase: CreateProductUseCase){}

  async execute(command: CreateProductCommand): Promise<void> {
    await this.createProductUseCase.execute({
      storeId: command.storeId,
      productId: command.productId,
      name: command.name,
      brandId: command.brandId,
      categoryId: command.categoryId,
      presentation: {
        presentationId: command.presentation.presentationId,
        imagePath: command.presentation.imagePath,
        value: command.presentation.value,
        unit: command.presentation.unit,
        salePrice: command.presentation.salePrice,
        barcode: command.presentation.barcode
      }
    })
  }

}