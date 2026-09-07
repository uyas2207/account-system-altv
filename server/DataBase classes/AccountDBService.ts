import { Kysely, Insertable, Updateable, Selectable } from 'kysely';
import { Database } from '../database/database';
import { Account } from '../database/database'

export class AccountDBService {
    protected readonly _db: Kysely<Database>
    
    constructor(db: Kysely<Database>){
        this._db = db;
        //account
        //accountId
    }

    async getRowByPrimaryKey(primaryKeyValue: Selectable<Database['account']>['accountId']){
        return await this._db.selectFrom('account').where(('accountId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
    }

    async deleteRowByPrimaryKey(primaryKeyValue: number){
        await (this._db).deleteFrom('account').where('accountId', '=', primaryKeyValue).executeTakeFirst();
        console.log('Выполнено удаление:', primaryKeyValue);
    }

    async updateRowMoneyByPrimaryKey(primaryKeyValue: number, moneyValue: number){
        await this._db
            .updateTable('account')
            .set({'money': moneyValue})
            .where('accountId', '=', primaryKeyValue).execute();
    }
    
    async insertNewRow(values: Insertable<Account>){
        await this._db
            .insertInto('account')
            .values(values)
            .execute();
    }

    async checkAccountLogin(playerLogin: Selectable<Database['account']>['login']){
        return await this._db.selectFrom('account').where('login', '=', playerLogin).selectAll().executeTakeFirst();
    }
}