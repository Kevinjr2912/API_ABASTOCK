import { Store } from "../entities/Store";

export interface StoreWriteRepository {
  save(store: Store): Promise<void>;
}
