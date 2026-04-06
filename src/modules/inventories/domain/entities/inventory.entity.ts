export class Inventory {
  constructor(
    private readonly inventoryId: string,
    private readonly storeId: string,
    private readonly presentationId: string,
    private readonly currentStock: number
  ) {}

  getId(): string { return this.inventoryId }
  getStoreId(): string { return this.storeId }
  getPresentationId(): string { return this.presentationId }
  getCurrentStock(): number { return this.currentStock }
}
