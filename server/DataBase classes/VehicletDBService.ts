import { Kysely, sql} from 'kysely';
import { Database } from '../database/database';
import { BaseDBService } from './BaseDBService'

export class VehicleDBService extends BaseDBService <'vehicles','vehId'>{
    constructor(db: Kysely<Database>){
        super(
            db, 
            'vehicles',
            'vehId'
        );
    }
}