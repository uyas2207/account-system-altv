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

/*     async addPlayertoAccountTable(playerLogin: string, playerPassword: string) {
        await this.db
        .insertInto('account')
        .values({
            login: playerLogin,
            password: playerPassword,
            money: 1000000              //при регистрации аккаунта у всех деффолтное значение денег, потом вынесу в конфиг
        })
        .execute();
    } */
}