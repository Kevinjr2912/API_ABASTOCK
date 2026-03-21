import { UserSession } from "../entities/user-session.entity";

export interface SessionWriteRepository {
  save(session: UserSession): Promise<void>;
}