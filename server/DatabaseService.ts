import * as alt from 'alt-server';
import { Kysely, sql} from 'kysely';
import { Database } from './database/database';
//import { db } from '../src/database';
interface IPlayerSession {
    accountId: number;
    login: string;
}
export class DatabaseService {
    private allLoginnedPlayers: Map < alt.Player, IPlayerSession > = new Map<alt.Player, IPlayerSession>();
    
    constructor( private readonly db: Kysely<Database> ){
        //this.#registerEventListeners(); //init

        //this.allActiveplayers = new Map(); 
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
    
    accountLoginValidation(player:alt.Player){
        return this.allLoginnedPlayers.has(player);
    }

    //вход в аккаунт
    // можно добавить кд на попытки и не больше 5 попыток за сессию
    async accountEnter(player: alt.Player, playerLogin: string, playerPassword: string){
        const currentPlayerDBData = await this.checkAccountLogin(playerLogin);

        if(this.allLoginnedPlayers.has(player)){
            throw new Error('Вы уже вошли в аккаунт');
        }
        if(this.allLoginnedPlayers.values().some(session => session.login === playerLogin)){
            throw new Error('Данный аккаунт уже используется');
        }
        if( (currentPlayerDBData === undefined) || (currentPlayerDBData.password !== playerPassword)){
            throw new Error('Введен некорректный логин или пароль');
        }
        //const id = currentPlayerDBData.accountId;
        //this.allLoginnedPlayers.values().some(login => login === playerLogin) ? (() => {throw new Error('Данный аккаунт уже используется')})() : null;
        this.allLoginnedPlayers.set(player, {
            accountId: currentPlayerDBData.accountId,
            login: playerLogin
        });
        //alt.emitClient(player, 'account:reciveAccountDataAfterEnter', currentPlayerDBData.login, currentPlayerDBData.password));
    }

    async vehicleDataValidation(ownerId: number, model: string, mainColour:string, secondaryColour:string, registrationNumber: string){
        const player = await this.db.selectFrom('account').where('accountId', '=', ownerId).selectAll().executeTakeFirst();
        if(!player || !model || !mainColour || !secondaryColour){
            throw new Error('Переданы некорректные данные, некоторые значения отсутсвуют');
        }

    }
    
    async carPurchaseAttempt(player: alt.Player, vehicle: alt.Vehicle, price: number){
        const playerData = this.allLoginnedPlayers.get(player);
        if(!playerData){
            throw new Error('Отсутсвуют данные игрока в allLoginnedPlayers');
        }
        const accountData = await this.getkDBAccountDataByID(playerData?.accountId);
        if((accountData?.money ?? 0) >= price){
            this.db.updateTable('account').set({money: sql`money - ${price}`}).where('accountId', '=', accountData!.accountId).execute();
        }
        else{
            throw new Error(`На аккаунте недостаточно денег. На аккаунте: ${accountData!.money} цена: ${price}`);
        }
    }

    async getkDBAccountDataByID(accountId: number){
        return await this.db.selectFrom('account').where('accountId', '=', accountId).selectAll().executeTakeFirst();
    }

    async checkAccountLogin(playerLogin: string/* , playerPassword: string,  */){
        const player = await this.db.selectFrom('account').where('login', '=', playerLogin).selectAll().executeTakeFirst();

        console.log('player', player?.accountId);
        
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

    //дебаг команда, команда потом убрать
    printAllLoginnedPlayers(){
        alt.log('Весь allLoginnedPlayers');
        this.allLoginnedPlayers.forEach((value, key) => {
            alt.log(`Ключ: ${(key)}`);
            alt.log('value:', (value));
        });
    }
}