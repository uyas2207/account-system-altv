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
    
    async checkAccountLogin(playerLogin: Database['account']['login']){
        return await this.db.selectFrom('account').where('login', '=', playerLogin).selectAll().executeTakeFirst();
    }
}