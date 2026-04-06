import { AsyncLocalStorage } from 'async_hooks';
import { PoolClient } from 'pg';

export const transactionContext = new AsyncLocalStorage<PoolClient>();