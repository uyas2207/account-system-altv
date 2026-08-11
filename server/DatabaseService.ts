import * as alt from 'alt-server';
import { Kysely } from 'kysely';
import { Database } from '../src/database';
//import { db } from '../src/database';

export class DatabaseService {
    constructor( private readonly db: Kysely<Database> ){
        //this.#registerEventListeners(); //init
    }

/*     #registerEventListeners(){


    } */
    // регистрация
    async registration(playerLogin: string, playerPassword: string, playerRepeatPassword: string){
        if( await this.checkAccountLogin(playerLogin) === undefined){
            console.log('Логин не занят');
            if(playerPassword !== playerRepeatPassword){
                throw new Error('Пароли на совпадают');
            }
            try {
                await this.testAddPlayer(playerLogin, playerPassword);
            } catch (error) {
                throw new Error('Произошла ошибка при добавлении аккаунта в базу данных');
            }
        }
        else{
            throw new Error('Данный логин не достпуен');
        }
    }
    
    //вход в аккаунт
    // можно добавить кд на попытки и не больше 5 попыток за сессию
    async accountEnter(playerLogin: string, playerPassword: string){
        const currentPlayerDBData = await this.checkAccountLogin(playerLogin);

        if( (currentPlayerDBData === undefined) || (currentPlayerDBData.password !== playerPassword)){
            throw new Error('Введен некорректный логин или пароль');
        }

        //alt.emitClient(player, 'account:reciveAccountDataAfterEnter', currentPlayerDBData.login, currentPlayerDBData.password));
    }

    async vehicleDataValidation(ownerId: number, model: string, mainColour:string, secondaryColour:string, registrationNumber: string){
        const player = await this.db.selectFrom('account').where('accountId', '=', ownerId).selectAll().executeTakeFirst();
        if(!player || !model || !mainColour || !secondaryColour){
            throw new Error('Переданы некорректные данные, некоторые значения отсутсвуют');
        }

    }
        
    async checkAccountLogin(playerLogin: string/* , playerPassword: string,  */){
        const player = await this.db.selectFrom('account').where('login', '=', playerLogin).selectAll().executeTakeFirst();

        console.log('player', player);
        
        if (player !== undefined){
            console.log(player.password);
        }
        
        return player;
    }

    async testAddPlayer(playerLogin: string, playerPassword: string) {
        await this.db
        .insertInto('account')
        .values({
            login: playerLogin,
            password: playerPassword,
            money: 1000000              //при регистрации аккаунта у всех деффолтное значение денег, потом вынесу в конфиг
        })
        .execute();
    }
    
    async testAddVehicle(ownerId: number, model: string, mainColour:string, secondaryColour:string, registrationNumber: string){
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
    async printPlayers(){
        const players = await this.db.selectFrom('account').selectAll().execute();
        console.log(players);
    }

    //дебаг команда, команда потом убрать
    async printVehicles(){
        const vehicles = await this.db.selectFrom('vehicles').selectAll().execute();
        console.log(vehicles);
    }
}