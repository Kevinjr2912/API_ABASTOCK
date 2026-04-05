export interface ImageStoragePort {
  save (imagePath: string): Promise<string>;
}