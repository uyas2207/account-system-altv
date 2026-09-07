import { Kysely, Insertable, Updateable, Selectable } from 'kysely';
import { Database } from '../database/database';
import { Vehicles } from '../database/database'

export class VehicleDBService {
    protected readonly _db: Kysely<Database>
    
    constructor(db: Kysely<Database>){
        this._db = db;
        //'vehicles'
        //'vehId'
    }

    async getRowByPrimaryKey(primaryKeyValue: Selectable<Database['vehicles']>['vehId']){
        return await this._db.selectFrom('vehicles').where(('vehId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
    }

    async deleteRowByPrimaryKey(primaryKeyValue: number){
        await (this._db).deleteFrom('vehicles').where('vehId', '=', primaryKeyValue).executeTakeFirst();
        console.log('Выполнено удаление:', primaryKeyValue);
    }

    async insertNewRow(values: Insertable<Vehicles>){
        await this._db
            .insertInto('vehicles')
            .values(values)
            .execute();
    }

    async updateRowRegistrationNumberByPrimaryKey(primaryKeyValue: number, registrationNumberValue: string){
        await this._db
            .updateTable('vehicles')
            .set({'registrationNumber': registrationNumberValue})
            .where('vehId', '=', primaryKeyValue).execute();
    }
}