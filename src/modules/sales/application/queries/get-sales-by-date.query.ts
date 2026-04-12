export class GetSalesByDateQuery {
  constructor(
    public readonly storeId: string,
    public readonly date: string
  ) {}
}
