import { Kysely, Insertable, sql } from 'kysely';
import { Database } from '../database/database';
import { ICustomColor } from '../types/IVehiclesConfig'
export abstract class BaseDBService<T extends keyof Database, K extends keyof Database[T]>{
    constructor(
        protected readonly db: Kysely<Database>,
        protected readonly tableName: T, 
        protected readonly primaryKeyName: K
    ){

    }

    async getRowByPrimaryKey(value: any){
        return await (this.db as any).selectFrom(this.tableName).where((this.primaryKeyName), '=', value).executeTakeFirst();
    }

    async deleteRowByPrimaryKey(value: any){
        return await (this.db as any).deleteFrom(this.tableName).where(this.primaryKeyName, '=', value).executeTakeFirst();
    }

/*     async insertNewRow( values: Insertable<Database[T]>): Promise<void> {
        const preparedValues = { ...values }
        console.log("typeof values", values);
        console.log("typeof preparedValues", preparedValues);

        await this.db
            .insertInto(this.tableName)
            .values(values)
            .execute();
    }  */
    

    async insertNewRow(values: Insertable<Database[T]>): Promise<void> {
/*     const preparedValues = values as any;


    for (const key in preparedValues) {
        const val = preparedValues[key];
        if (val === 'object') {
            preparedValues[key] = JSON.stringify(val);
        }
    } */


    await sql`
    INSERT INTO vehicles (ownerId, model, mainColour, secondaryColour) 
    VALUES (${ownerId}, ${model}, ${mainColour}, ${secondaryColour})
    `.execute(this.db);

/*     await this.db
        .insertInto(this.tableName)
        .values(values)
        .execute(); */
}
/*   async getAllTable(){
        return await this.db.selectFrom(this.tableName).selectAll().execute();
    } */
    
    async printAllTable(){
        console.log(await this.db.selectFrom(this.tableName).selectAll().execute());
    }
}