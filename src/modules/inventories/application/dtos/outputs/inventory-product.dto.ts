export interface InventoryProductDto {
  presentationId: string;
  inventoryId:    string;
  currentStock:   number;
  productName:    string;
  brandName:      string;
  categoryName:   string;
  salePrice:      number;
  imageUri:       string;
  value:          number;
  unit:           string;
  barcode:        string;
}