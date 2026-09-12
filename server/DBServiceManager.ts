import { Kysely, Transaction } from 'kysely';

import { Database } from './database/database';
import { AccountDBService } from "./DataBase_classes/AccountDBService";
import { VehicleDBService } from "./DataBase_classes/VehicletDBService";

export class DBServiceManager {
    protected readonly _db: Kysely<Database>
    public readonly account: AccountDBService;
    public readonly vehicle : VehicleDBService;

    constructor(db: Kysely<Database>) {
        this._db = db;
        this.account = new AccountDBService(this._db);
        this.vehicle = new VehicleDBService(this._db);
    }

    async transaction<T>(
        callback: (trx: Transaction<Database>) => Promise<T>
    ): Promise<T> {
        // Запускаем транзакцию через встроенный метод Kysely
        return await this._db.transaction().execute(async (trx) => {
            // Передаем управление в ваш callback и прокидываем туда 'trx'
            return await callback(trx);
        });
    }
}