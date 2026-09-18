import { Kysely, Insertable, Transaction, DeleteResult, InsertResult, UpdateResult } from 'kysely';
import { Database, AccountTable, Account } from '../database/database'

export class AccountDBService {
    protected readonly _db: Kysely<Database>
    
    constructor(db: Kysely<Database>){
        this._db = db;
        //account
        //accountId
    }

    async getRowByPrimaryKey(primaryKeyValue: Account['accountId'], trx?: Transaction<Database>): Promise<Account | undefined> {
        const executor = trx || this._db;
        return await executor
            .selectFrom('account').where(('accountId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
    }

    async deleteRowByPrimaryKey(primaryKeyValue: number, trx?: Transaction<Database>): Promise<DeleteResult> {
        const executor = trx || this._db;
        return await executor
            .deleteFrom('account').where('accountId', '=', primaryKeyValue).executeTakeFirst();
    }

    async getMoneyByPrimaryKey(primaryKeyValue: number, trx?: Transaction<Database>): Promise<number | undefined> {
        const executor = trx || this._db;
        const result = await executor
            .selectFrom('account').where(('accountId'), '=', primaryKeyValue).selectAll().executeTakeFirst();
        return result?.money;
    }

    async updateMoneyByPrimaryKey(primaryKeyValue: number, moneyValue: number, trx?: Transaction<Database>): Promise<UpdateResult[]> {
        const executor = trx || this._db;
        return await executor
            .updateTable('account')
            .set({'money': moneyValue})
            .where('accountId', '=', primaryKeyValue).execute();
    }
    
    async insertNewRow(values: Insertable<AccountTable>): Promise<InsertResult[]> {
        return await this._db
            .insertInto('account')
            .values(values)
            .execute();
    }

    async getDataByAccountLogin(playerLogin: Account['login']): Promise<Account | undefined> {
        return await this._db.selectFrom('account').where('login', '=', playerLogin).selectAll().executeTakeFirst();
    }
}