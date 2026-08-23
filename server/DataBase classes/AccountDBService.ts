import { Kysely, sql} from 'kysely';
import { Database } from '../database/database';
import { BaseDBService } from './BaseDBService'

export class AccountDBService extends BaseDBService <'account','accountId'>{
    constructor(db: Kysely<Database>){
        super(
            db, 
            'account',
            'accountId'
        );
    }
}