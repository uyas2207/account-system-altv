import alt from 'alt-server';

import { Kysely, Insertable, Transaction, Selectable } from 'kysely';
import { Database } from '../database/database';
import { VehiclesTable, VehiclesUpdate } from '../database/database'

export class VehicleDBService {
    protected readonly _db: Kysely<Database>
    
    constructor(db: Kysely<Database>){
        this._db = db;
        //'vehicles'
        //'vehId'
    }

    async getRowByPrimaryKey(primaryKeyValue: Selectable<Database['vehicles']>['vehId'], trx?: Transaction<Database>){
        const executor = trx || this._db;
        return await executor
            .selectFrom('vehicles').where(('vehId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
    }

    async deleteRowByPrimaryKey(primaryKeyValue: number, trx?: Transaction<Database>){
        const executor = trx || this._db;
        return await executor
            .deleteFrom('vehicles').where('vehId', '=', primaryKeyValue).executeTakeFirst();
    }

    async insertNewRow(values: Insertable<VehiclesTable>, trx?: Transaction<Database>){
        const executor = trx || this._db;
        return await executor
            .insertInto('vehicles')
            .values(values)
            .execute();
    }

    async updateRegistrationNumberByPrimaryKey(primaryKeyValue: number, registrationNumberValue: string){
        await this._db
            .updateTable('vehicles')
            .set({'registrationNumber': registrationNumberValue})
            .where('vehId', '=', primaryKeyValue).execute();
    }

    async updateColorsByPrimaryKey(primaryKeyValue: number, updateWith: VehiclesUpdate){
        await this._db
            .updateTable('vehicles')
            .set(updateWith)
            .where('vehId', '=', primaryKeyValue).execute();
        
/*         await this._db
            .updateTable('vehicles')
            .set({'secondaryColor': secondaryColor},)
            .where('vehId', '=', primaryKeyValue).execute(); */
    }

    async getAllVehsByAccountId(accountId: Selectable<Database['vehicles']>['ownerId']){
        return await this._db
            .selectFrom('vehicles')
            .where(('ownerId'), '=', accountId).selectAll().execute();
    }
}