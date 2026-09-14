import * as alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию
import { defaultParameters } from "./config/VehConfig";

import { CarShopServer } from './CarShopServer'
import { AccountManager } from './AccountManager'
import { SpawnedVehsManager } from './SpawnedVehsManager'

import { DBTransactionManager } from './DataBase_classes/DBTransactionManager';


interface IVehData {
    accountId: number;
    model: string;
    price: number;
    vehOwnerId: number;
    vehId: number;
}


export class CommandManager {
    constructor(
        private readonly accoutManager: AccountManager, 
        private readonly carShopServer: CarShopServer,
        private readonly vehiclesManager: SpawnedVehsManager,
        private readonly DBTransactionManager: DBTransactionManager
        
    ){
        this._registerCommands();
    }

    private _registerCommands(): void {

        chat.registerCmd('buy', async (player: alt.Player) => {
            try {
                const veh = this._checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
                await this._onCarPurchaseAttempt(player, veh);
            } catch (error) {
                if(error instanceof Error){
                    chat.send(player, ` ${error.message}`);
                }
            }
        });

        chat.registerCmd('sell', async (player: alt.Player) => {
            try{
                const veh = this._checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
                await this._onCarSellAttempt(player, veh);
            }
            catch(error){
                if(error instanceof Error){
                    chat.send(player, ` ${error.message}`);
                }
            }
        });

        // register login password repeat-password
        chat.registerCmd('register', async (player: alt.Player, args: Array<string>) => {
            const login = args[0]
            const password = args[1];
            const repeatPassword = args[2];

            if(!login || !password || !repeatPassword){
                chat.send(player,"/register <login> <password> <repeat-password>");
                chat.send(player,"Не введены значения login, password или repeat-password");
                return;
            }
            try {
                await this.accoutManager.onAccountRegisterAttempt(player, login, password, repeatPassword);
                chat.send(player,`Вы успешно зарегистрировались и вошли в аккаунт с логином ${login}`);
            } catch (error) {
                chat.send(player, `${error}`);
            }
        });
        // login login password
        chat.registerCmd('login', async (player: alt.Player, args: Array<string>) => {
            if(!args[0] || !args[1]){
                chat.send(player,"/login <login> <password>");
                chat.send(player,"Не введены значения password или login");
                return;
            }
            try {
                await this.accoutManager.onAccountEnterAttempt(player, args[0], args[1]);
                chat.send(player,'Вы успешно вошли в аккаунт');
            } catch (error) {
                chat.send(player, `${error}`);
            }
        });
        // myvehs
        chat.registerCmd('myvehs', async (player: alt.Player) => {
            try {
                const allCurrentPlayerVehs = await this.carShopServer.requestVehsByPlayer(player);
                allCurrentPlayerVehs.forEach(element => {
                    const model = element.model;
                    chat.send(player, `${model} (${model.toLowerCase()}) - ID: ${element.vehId}`);
                });
            } catch (error) {
                chat.send(player, `${error}`);
            }
        });
        //spawnveh ID
        chat.registerCmd('spawnveh', async (player: alt.Player, args: Array<string>) => {
            if(!args[0]){
                chat.send(player,"/spawnveh <ID>");
                chat.send(player,"Не введено значение ID");
                return;
            }
            
            try {
                await this._onSpawnVehicleAttempt(player, args[0]);
            } catch (error) {
                chat.send(player,` ${error}`);
            }
        });
        //color color1 color2
        chat.registerCmd('color', async (player: alt.Player, args: Array<string>) => {
            if(!args[0] || !args[1]){
                chat.send(player,"/color <color1> <color2>");
                chat.send(player,"Не введены цвета для смены");
                return;
            }
            const color1 = Number(args[0]);
            const color2 = Number(args[1]);
            if(!this._isValidColorNumber(color1) || !this._isValidColorNumber(color2)){
                chat.send(player, "/color <color1> <color2>");
                chat.send(player, "Цветом может быть только целое число от 0 до 160");
                return;
            }
            try {
                const veh = this._checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
                const accountId = this.accoutManager.requestPlayerAccountId(player);
                const ownerId = this.vehiclesManager.getSpawnedVehicleOwnerId(veh);
                if(ownerId === accountId){
                    veh.primaryColor = color1;
                    veh.secondaryColor = color2;
                    const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
                    this.carShopServer.changeVehColor(vehId!, color1, color2);
                }
                else{
                    chat.send(player, "Вы не являетесь владельцем авто");
                }
            } catch (error) {
                chat.send(player,` ${error}`);
            }
        });

        chat.registerCmd('logout', (player: alt.Player) => {
            this.accoutManager.accountExit(player);
        });
    }

    private async _onSpawnVehicleAttempt(player: alt.Player, arg: string): Promise<void> {
        const allCurrentPlayerVehs = await this.carShopServer.requestVehsByPlayer(player);
        const allVehIds = allCurrentPlayerVehs.map(playerVeh => playerVeh.vehId);
        const id = Number(arg);
        if(!(allVehIds.includes(id))){
            throw new Error("У вас нет авто стаким id");
        }
        const vehData = allCurrentPlayerVehs.find(playerVeh => playerVeh.vehId === id);
        if(!vehData){
            throw new Error("Не удалось получить необходимые данные об авто");
        }
        const result = this.vehiclesManager.checkAllSpawnedVehicles(vehData.vehId);
        if(!result){
            this.vehiclesManager.spawnVehicle(player, vehData!);
            chat.send(player, "Машина успешно заспавнена");
        }
        else{
            result.pos = player.pos;
            chat.send(player, "Машина успешно телпортирована");
        }
    }

    private async _onCarPurchaseAttempt(player: alt.Player, veh: alt.Vehicle): Promise<void>{
        this.carShopServer.checkIsCarForSale(player);
        const data = this._getPlayerVehData(player, veh);
        
        const vehDBId = await this.DBTransactionManager.transaction(async (trx) => {
            const playerMoney = await this.DBTransactionManager.account.getMoneyByPrimaryKey(data.accountId, trx);
            if (typeof playerMoney !== "number") {
                throw new Error(`Игрок с ID ${data.accountId} не найден в базе данных`);
            }
            if(playerMoney < data.price){
                throw new Error("На аккаунте недостаточно денег");
            }

            const moneyAfterOperation = playerMoney - data.price;
            await this.DBTransactionManager.account.updateMoneyByPrimaryKey(data.accountId, moneyAfterOperation, trx);
            
            const result = await this.DBTransactionManager.vehicle.insertNewRow({
                ownerId: data.accountId,
                model: data.model,
                primaryColor: veh.primaryColor,
                secondaryColor: veh.secondaryColor,
                price: data.price
            }, trx);

            return result;
        });
        if(vehDBId) {
            const id = Number(vehDBId[0]!.insertId);
            this.vehiclesManager.addVehicle(id, veh, data.accountId, false);
        }
        chat.send(player, 'МАШИНА КУПЛЕНА УСПЕШНО');
        veh.deleteStreamSyncedMeta('CarForSaleId');
    }
    
    private async _onCarSellAttempt(player: alt.Player, veh: alt.Vehicle): Promise<void>{
        const data = this._getPlayerVehData(player, veh);
        
        if(data.vehOwnerId !== data.accountId){
            throw new Error ("Вы не являетесь владельцем авто");
        }
        if(!data.vehOwnerId || !data.vehId){
            alt.logError(`Не хватает данных, vehOwnerId: ${data.vehOwnerId}, vehId: ${data.vehId}`);
            throw new Error("Произошла непредвиденная ошибка");
        }

        await this.DBTransactionManager.transaction(async (trx) => {
            const currentPlayerMoney = await this.DBTransactionManager.account.getMoneyByPrimaryKey(data.accountId, trx);
            if(typeof currentPlayerMoney !== "number"){
                throw new Error("Не удалось получить кол-во денег на аккаунте");
            }
            const resultMoney = Math.trunc(currentPlayerMoney + (data.price * defaultParameters.percentageForSell));
            await this.DBTransactionManager.vehicle.deleteRowByPrimaryKey(data.vehId, trx);
            await this.DBTransactionManager.account.updateMoneyByPrimaryKey(data.accountId, resultMoney, trx);
        });
        this.vehiclesManager.checkVehicleBeforeDestroy(veh);
    }

    //как правильно использовать метод _getPlayerVehData что бы он возвращал только нужные данные 
    private _getPlayerVehData(player: alt.Player, veh: alt.Vehicle): IVehData{
        const accountId = this.accoutManager.requestPlayerAccountId(player);
        const model = (alt.getVehicleModelInfoByHash(veh.model).title);
        const price = this.carShopServer.findVehPriceInConfig(model);
        const vehOwnerId = this.vehiclesManager.getSpawnedVehicleOwnerId(veh) ?? 0;
        const vehId = this.vehiclesManager.getSpawnedVehicleId(veh) ?? 0;
        //пытался вынести проверку в findVehPriceInConfig, но тс выдавал ошибку поэтому проверка тут
        if(!price){
            alt.logError("Попытка купить машину которой нет в конфиге model:", model);
            throw new Error("Не удалось купить машину");  
        }
        return({ accountId, model, price, vehOwnerId, vehId });
    }
    //ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    //для проверки что цвет число и входит в список цветов altv
    private _isValidColorNumber(num: number): boolean {
        return Number.isInteger(num) && num >= 0 && num < 161;
    }
    //если игрок не в авто Error, если в авто вернет player.vehicle
    private _checkIsPlayerInVehicle(player: alt.Player): alt.Vehicle {
        const veh = player.vehicle;
        if(!veh){
            throw new Error("Для использования команды необходимо находитсья в машине");
        }
        return veh;
    }
}