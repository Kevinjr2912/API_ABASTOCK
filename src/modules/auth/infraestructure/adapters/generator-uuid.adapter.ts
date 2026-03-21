import { Injectable } from "@nestjs/common";
import { GeneratorUUIDPort } from "../../application/ports/generator-uuid.port";

@Injectable()
export class GeneratorUUIDAdapter implements GeneratorUUIDPort {
  generate(): string {
    return crypto.randomUUID();
  }
}