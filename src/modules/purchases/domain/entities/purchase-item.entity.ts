export class PurchaseItem {
    constructor(
        private readonly purchaseItemId: string,
        private readonly presentationId: string,
        private readonly inventoryId: string,
        private readonly quantity: number,
        private readonly costPrice: number,
        private readonly salePrice: number
    ) {}

    getId(): string {
        return this.purchaseItemId;
    }

    getPresentationId(): string {
        return this.presentationId;
    }

    getInventoryId(): string {
        return this.inventoryId;
    }

    getQuantity(): number {
        return this.quantity;
    }

    getCostPrice(): number {
        return this.costPrice;
    }

    getSalePrice(): number {
        return this.salePrice;
    }

    getTotalCost(): number {
        return this.quantity * this.costPrice;
    }
}