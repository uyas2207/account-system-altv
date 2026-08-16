import * as alt from 'alt-server';
import { Kysely, sql} from 'kysely';
import { Database } from '../database/database';

export class DatabaseExecutionService {
    constructor( private readonly db: Kysely<Database> ){
        
    }

    async getAccountByLogin(playerLogin: string){
        return await this.db.selectFrom('account').where('login', '=', playerLogin).selectAll().executeTakeFirst();
    }

    async getAccountByAccountId(accountId: number){
        return await this.db.selectFrom('account').where('accountId', '=', accountId).selectAll().executeTakeFirst();
    }

    async removeMoneyFromAccount(money: number, accountId: number, price:number){
        this.db.updateTable('account').set({money: sql`money - ${price}`}).where('accountId', '=', accountId).execute();
    }
    
    async addPlayertoAccountTable(playerLogin: string, playerPassword: string) {
        await this.db
        .insertInto('account')
        .values({
            login: playerLogin,
            password: playerPassword,
            money: 1000000              //при регистрации аккаунта у всех деффолтное значение денег, потом вынесу в конфиг
        })
        .execute();
    }
    
    async addVehicletoVehiclesTable(ownerId: number, model: string, mainColour:string, secondaryColour:string, registrationNumber: string){
        await this.db
        .insertInto('vehicles')
        .values({
            ownerId: ownerId,
            model: model,
            mainColour: mainColour,
            secondaryColour: secondaryColour,
            registrationNumber: registrationNumber
        })
        .execute();
    }

    //дебаг команда, команда потом убрать
    async printAllPlayers(){
        const players = await this.db.selectFrom('account').selectAll().execute();
        console.log(players);
    }

    //дебаг команда, команда потом убрать
    async printAllVehicles(){
        const vehicles = await this.db.selectFrom('vehicles').selectAll().execute();
        console.log(vehicles);
    }
}