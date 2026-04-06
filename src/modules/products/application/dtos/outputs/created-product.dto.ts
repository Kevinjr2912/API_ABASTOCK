export interface CreatedProductDto {
  productId: string;
  productName: string;
  brandId: string;
  categoryId: string;
  presentation: {
    presentationId: string;
    barcode: number;
    imageUri: string;
    value: number;
    unit: string;
    salePrice: number;
  };
}