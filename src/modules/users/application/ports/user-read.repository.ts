import { User } from '../../domain/entities/User';

export interface UserReadRepository {
  existsByEmail(email: string): Promise<boolean>;
  findByEmail(email: string): Promise<User | null>;
}
