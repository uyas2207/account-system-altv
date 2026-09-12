import { Kysely, Insertable, Transaction, Selectable } from 'kysely';
import { Database } from '../database/database';
import { Account } from '../database/database'

export class AccountDBService {
    protected readonly _db: Kysely<Database>
    
    constructor(db: Kysely<Database>){
        this._db = db;
        //account
        //accountId
    }

    async getRowByPrimaryKey(primaryKeyValue: Selectable<Database['account']>['accountId'], trx?: Transaction<Database>){
        const executor = trx || this._db;
        return await executor
            .selectFrom('account').where(('accountId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
    }

    async deleteRowByPrimaryKey(primaryKeyValue: number, trx?: Transaction<Database>){
        const executor = trx || this._db;
        return await executor
            .deleteFrom('account').where('accountId', '=', primaryKeyValue).executeTakeFirst();
    }

    async getMoneyByPrimaryKey(primaryKeyValue: number, trx?: Transaction<Database>){
        const executor = trx || this._db;
        const result = await executor
            .selectFrom('account').where(('accountId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
        return result?.money;
    }

    async updateMoneyByPrimaryKey(primaryKeyValue: number, moneyValue: number, trx?: Transaction<Database>){
        const executor = trx || this._db;
        return await executor
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