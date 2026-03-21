import { UserSession } from "../../domain/entities/user-session.entity";

export interface SessionReadRepository {
  findById(sessionId: string): Promise<UserSession | null>;
}