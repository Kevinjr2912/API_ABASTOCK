import { User } from "../entities/User";

export interface UserWriteRepository {
  save(user: User): Promise<void>;
}
