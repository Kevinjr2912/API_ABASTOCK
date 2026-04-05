export class CreateProductDto {
  storeId!:          string;  
  productId!:        string;
  name!:             string;
  brandId!:          string;
  categoryId!:       string;
  presentation!: {
    presentationId: string;
    imagePath:      string,
    value:          number;
    unit:           string;
    salePrice:      number;
    barcode: {
      barcodeId:    string; 
      code:         string; 
      isActive?:    boolean; 
    }
  }
}