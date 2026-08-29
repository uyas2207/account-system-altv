import { Kysely, Insertable, Updateable, Selectable } from 'kysely';
import { Database } from '../database/database';
    
export abstract class BaseDBService<T extends keyof Database, K extends keyof Selectable<Database[T]>>{
    constructor(
        protected readonly db: Kysely<Database>,
        protected readonly tableName: T, 
        protected readonly primaryKeyName: K
    ){

    }
    //value может быть только значением table по ключу primaryKey K
    async getRowByPrimaryKey(value: Selectable<Database[T]>[K]){
        return await (this.db as any).selectFrom(this.tableName).where((this.primaryKeyName), '=', value).selectAll().executeTakeFirst();
    }
    //value может быть только значением table по ключу primaryKey K
    async deleteRowByPrimaryKey(value: Selectable<Database[T]>[K]){
        await (this.db as any).deleteFrom(this.tableName).where(this.primaryKeyName, '=', value).executeTakeFirst();
        console.log('Выполнено удаление:', value);
    }
    //поиск конкретного value по переданному columnName
    async getRowByColumnName<C extends keyof Selectable<Database[T]>>(columnName: C, value: Selectable<Database[T]>[C]){
        return await (this.db as any).selectFrom(this.tableName).where((columnName), '=', value).selectAll().executeTakeFirst();
    }

    //принимаемым значением value может быть только тот тип значения который является типом columnName
    async updateRowByPrimaryKey<C extends keyof Updateable<Database[T]>>(primaryKeyValue: keyof K, columnName: C, value: Updateable<Database[T]>[C]){
        await (this.db as any).updateTable(this.tableName).set({[columnName]: value}).where(this.primaryKeyName, '=', primaryKeyValue).execute();
    }
    
    //values: Insertable<Database[T]> нужен для того что бы отправляемые в метод знаечния не могли не соответсововать типу данных из БД
    async insertNewRow(values: Insertable<Database[T]>)/* : Promise<void>  */{
        //но почему то если я пытаюсь записать объект типа IColorRGBA в стринг для корректной записаси появляется ошибка
        //Type 'string' is not assignable to type 'Insertable<Database[T]>[Extract<keyof Insertable<Database[T]>, string>]'
        //а если не переводить в стринг объект типа IColorRGBA то он не запишется в БД из-за ошибки Error: CONSTRAINT
        //так как в бд отправляется строка { r: 0, g: 255, b: 0, a: 255 } вместо { "r": 0, "g": 255, "b": 0, "a": 255 }
        //поэтому перед отправкой надо сделать JSON.stringify, а для того что бы на такое не ругался ts нужно сделать values as any
        //по идее values as any ничем не мешает так как проверка на правильный тип значений уже была выполнена в values: Insertable<Database[T]>

        const preparedValues = values as any;

        for (const key in preparedValues) {
            const currentValue = preparedValues[key];
            if (typeof currentValue === 'object') {
                preparedValues[key] = JSON.stringify(currentValue);
            }
        }

        await this.db
            .insertInto(this.tableName)
            .values(preparedValues)
            .execute();
    }

    
/*     async sqlRequestUpdateRowByPrimaryKey(primaryKeyValue: any, columnName: string, value: string){
        await (this.db as any).updateTable(this.tableName).set({[columnName]: sql`${value}`}).where(this.primaryKeyName, '=', primaryKeyValue).execute();
    } */
    
    async printAllTable(){
        console.log(await this.db.selectFrom(this.tableName).selectAll().execute());
    }
}