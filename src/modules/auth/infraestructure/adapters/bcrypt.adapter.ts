import { Injectable } from "@nestjs/common";
import { HashPort } from "../../application/ports/hash.port";
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter implements HashPort {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(value, hashed);
  }
}