export interface StoreReadRepository {
  existsByName(userId: string, name: string): Promise<boolean>;
}