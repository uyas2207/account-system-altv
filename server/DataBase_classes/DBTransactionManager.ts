import { Kysely, Transaction } from 'kysely';

import { Database } from '../database/database';
import { AccountDBService } from "./AccountDBService";
import { VehicleDBService } from "./VehicletDBService";

export class DBTransactionManager {
    protected readonly _db: Kysely<Database>
    public readonly account: AccountDBService;
    public readonly vehicle : VehicleDBService;

    constructor(db: Kysely<Database>, accountDBService: AccountDBService, vehicleDBService: VehicleDBService) {
        this._db = db;
        this.account = accountDBService;
        this.vehicle = vehicleDBService;
    }

    async transaction<T>(
        callback: (trx: Transaction<Database>) => Promise<T>
    ): Promise<T> {
        return await this._db.transaction().execute(async (trx) => {
            return await callback(trx);
        });
    }
}