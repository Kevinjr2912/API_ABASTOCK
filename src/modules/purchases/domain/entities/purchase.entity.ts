import { PurchaseItem } from "./purchase-item.entity";

export class Purchase {
    private purchaseItems: PurchaseItem[] = [];

    constructor(
        private readonly purchaseId: string,
        private readonly storeId: string,
        private readonly purchaseDate: Date,
        private readonly totalCost: number
    ) {}

    getId(): string {
        return this.purchaseId;
    }

    getStoreId(): string {
        return this.storeId;
    }

    getPurchaseDate(): Date {
        return this.purchaseDate;
    }

    getTotalCost(): number {
        return this.totalCost;
    }

    getPurchaseItems(): PurchaseItem[] {
        return this.purchaseItems;
    }

    addPurchaseItem(item: PurchaseItem): void {
        this.purchaseItems.push(item);
    }
}