import { Kysely, Insertable, Transaction, InsertResult, DeleteResult, UpdateResult } from 'kysely';
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

    async insertNewRow(values: Insertable<VehiclesTable>, trx?: Transaction<Database>): Promise<InsertResult> {
        const executor = trx || this._db;
        return await executor
            .insertInto('vehicles')
            .values(values)
            .executeTakeFirst();
    }

    async updateRegistrationNumberByPrimaryKey(primaryKeyValue: number, registrationNumberValue: string): Promise<UpdateResult> {
        return await this._db
            .updateTable('vehicles')
            .set({'registrationNumber': registrationNumberValue})
            .where('vehId', '=', primaryKeyValue).executeTakeFirst();
    }

    async updateColorsByPrimaryKey(primaryKeyValue: number, primaryColor: number, secondaryColor: number): Promise<UpdateResult> {
        return await this._db
            .updateTable('vehicles')
            .set({            
                primaryColor: primaryColor,
                secondaryColor: secondaryColor
            })
            .where('vehId', '=', primaryKeyValue).executeTakeFirst();
    }

    async getAllVehsByAccountId(accountId: Vehicles['ownerId']): Promise<Vehicles[]> {
        return await this._db
            .selectFrom('vehicles')
            .where(('ownerId'), '=', accountId).selectAll().execute();
    }
}