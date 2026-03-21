import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, PoolClient, Result } from 'pg';

@Injectable()
export class PostgreSQl {
    private pool : Pool;

    constructor(private readonly configService: ConfigService) {
        this.pool = new Pool({
            host: this.configService.get<string>('DATABASE.DB_HOST'),
            user: this.configService.get<string>('DATABASE.DB_USER'),
            password: this.configService.get<string>('DATABASE.DB_PASSWORD'),
            database: this.configService.get<string>('DATABASE.DB_NAME'),
            port: this.configService.get<number>('DATABASE.DB_PORT'),
            max: 10,
        }); 
    }

    async getClient (): Promise<PoolClient> {
        return this.pool.connect();
    }

    async query (text: string, values?: any[]) : Promise<Result> {
        return this.pool.query(text, values);
    }

}