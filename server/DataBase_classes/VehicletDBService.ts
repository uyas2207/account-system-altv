import alt from 'alt-server';

import { Kysely, Insertable, Transaction, Selectable, InsertResult, DeleteResult } from 'kysely';
import { Database, VehiclesTable, VehiclesUpdate, Vehicles } from '../database/database'

export class VehicleDBService {
    protected readonly _db: Kysely<Database>
    
    constructor(db: Kysely<Database>){
        this._db = db;
        //tableName = 'vehicles';
        //tablePrimaryKey = 'vehId';
    }

    async getRowByPrimaryKey(primaryKeyValue: Vehicles['vehId'], trx?: Transaction<Database>): Promise<Vehicles | undefined> {
        const executor = trx || this._db;
        return await executor
            .selectFrom('vehicles').where(('vehId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
    }

    async deleteRowByPrimaryKey(primaryKeyValue: number, trx?: Transaction<Database>): Promise<DeleteResult> {
        const executor = trx || this._db;
        return await executor
            .deleteFrom('vehicles').where('vehId', '=', primaryKeyValue).executeTakeFirst();
    }

    async insertNewRow(values: Insertable<VehiclesTable>, trx?: Transaction<Database>): Promise<InsertResult[]> {
        const executor = trx || this._db;
        return await executor
            .insertInto('vehicles')
            .values(values)
            .execute();
    }

    async updateRegistrationNumberByPrimaryKey(primaryKeyValue: number, registrationNumberValue: string): Promise<void> {
        await this._db
            .updateTable('vehicles')
            .set({'registrationNumber': registrationNumberValue})
            .where('vehId', '=', primaryKeyValue).execute();
    }

    async updateColorsByPrimaryKey(primaryKeyValue: number, updateWith: VehiclesUpdate): Promise<void> {
        await this._db
            .updateTable('vehicles')
            .set(updateWith)
            .where('vehId', '=', primaryKeyValue).execute();
    }

    async getAllVehsByAccountId(accountId: Vehicles['ownerId']): Promise<Vehicles[]> {
        return await this._db
            .selectFrom('vehicles')
            .where(('ownerId'), '=', accountId).selectAll().execute();
    }
}