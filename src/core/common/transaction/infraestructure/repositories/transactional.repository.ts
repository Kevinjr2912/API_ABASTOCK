import { PostgreSQl } from "src/core/database/PostgreSQL";
import { transactionContext } from "../contexts/transaction-context";

export abstract class TransactionalRepository {
  constructor(protected readonly db: PostgreSQl) {}

  protected getRunner() {
    return transactionContext.getStore() ?? this.db;
  }
}