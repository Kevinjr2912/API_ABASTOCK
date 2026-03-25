export class Store {
  constructor(
    private readonly id: string,
    private readonly userId: string,
    private readonly name: string,
  ) {}

  getId() {
    return this.id;
  }
  getUserId() {
    return this.userId;
  }
  getName() {
    return this.name;
  }
}
