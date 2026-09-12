import * as alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

/* import { DatabaseService } from './DatabaseService' */
import { CarShopServer } from './CarShopServer'
import { AccountManager } from './AccountManager'
import { SpawnedVehsManager } from './SpawnedVehsManager'

import { AccountDBService } from './DataBase_classes/AccountDBService';
import { VehicleDBService } from './DataBase_classes/VehicletDBService';
import { DBServiceManager } from './DBServiceManager';

export class CommandManager {
    constructor(
        private readonly accoutManager: AccountManager, 
        private readonly carShopServer: CarShopServer,
        private readonly vehiclesManager: SpawnedVehsManager,
        private readonly dbServiceManager: DBServiceManager
        
    ){
        this.#init();
    }

    #init(){
    
        chat.registerCmd('buy', async (player: alt.Player) => {
            try {
                const requestPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
                const veh = this.carShopServer.checkIsCarForSale(player);
                const model = alt.getVehicleModelInfoByHash(veh.model)
                const price = this.carShopServer.findVehPriceInConfig((model.title).toLowerCase());
                if(!price){
                    alt.logError("Попытка купить машину которой нет в конфиге model:", model);
                    throw new Error("Не удалось купить машину");
                }
                const vehDBId = await this.dbServiceManager.transaction(async (trx) => {
                    const currentPlayerMoney = await this.dbServiceManager.account.getMoneyByPrimaryKey(requestPlayerAccountId, trx);
                    if (typeof currentPlayerMoney !== "number") {
                        throw new Error(`Игрок с ID ${requestPlayerAccountId} не найден в базе данных`);
                    }
                    const money = currentPlayerMoney ?? 0;
                    if(money < price){
                        throw new Error("На аккаунте недостаточно денег");
                    }

                    const moneyAfterOperation = money - price;
                    await this.dbServiceManager.account.updateMoneyByPrimaryKey(requestPlayerAccountId, moneyAfterOperation, trx);
                    
                    const result = await this.dbServiceManager.vehicle.insertNewRow({
                        ownerId: requestPlayerAccountId,
                        model: model.title,
                        primaryColor: veh.primaryColor,
                        secondaryColor: veh.secondaryColor,
                        price: price
                    }, trx);

                    return result;
                });
                if(vehDBId){
                    const id = Number(vehDBId[0]!.insertId);
                    this.vehiclesManager.addVehicle(id, veh, requestPlayerAccountId, false);
                }
                chat.send(player, 'МАШИНА КУПЛЕНА УСПЕШНО');
                veh.deleteStreamSyncedMeta('CarForSaleId');
            } catch (error) {
                if(error instanceof Error){
                    chat.send(player, `Произошла  ошибка: ${error.message}`);
                }
            }
        });
        // register login password repeat-password
        chat.registerCmd('register', (player: alt.Player, args: Array<string>) => {
            const login = args[0]
            const password = args[1];
            const repeatPassword = args[2];

            console.log('login, password, repeatPassword', login, password, repeatPassword)

            if(login === undefined || password === undefined || repeatPassword === undefined){
                chat.send(player,"/register <login> <password> <repeat-password>");
                chat.send(player,"Не введены значения login, password или repeat-password");
                return;
            }
            try {
                this.accoutManager.onAccountRegisterAttempt(player, login, password, repeatPassword);
            } catch (error) {
                chat.send(player,'Произошла  ошибка:', error);
            }
        });
        // login login password
        chat.registerCmd('login', (player: alt.Player, args: Array<string>) => {
            //chat.send(player, 'test message with args:');
            if(args[0] === undefined || args[1] === undefined){
                chat.send(player,"/login <login> <password>");
                chat.send(player,"Не введены значения password или login");
                return;
            }
            try {
                this.accoutManager.onAccountEnterAttempt(player, args[0], args[1]);
                chat.send(player,'Вы успешно вошли в аккаунт');
            } catch (error) {
                chat.send(player,'Произошла  ошибка:', error);
            }
        });
        // myvehs
        chat.registerCmd('myvehs', async (player: alt.Player) => {
            try {
                const allCurrentPlayerVehs = await this.carShopServer.requestVehsByPlayer(player);
                console.log("allCurrentPlayerVehs", allCurrentPlayerVehs);
                allCurrentPlayerVehs.forEach(element => {
/*                     const IVehicleModel = (element.model);
                    const model = IVehicleModel; */
                    const model = element.model;
                    console.log(`${model} (${model}) - ID: ${element.vehId}`);
                    chat.send(player, `${model} (${model}) - ID: ${element.vehId}`);
                });
                //chat.send(player,'');
            } catch (error) {
                chat.send(player,'Произошла  ошибка:', error);
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
                const allCurrentPlayerVehs = await this.carShopServer.requestVehsByPlayer(player);
                const allVehIds = allCurrentPlayerVehs.map(playerVeh => playerVeh.vehId);
                const id = Number(args[0]);
                if(!(allVehIds.includes(id))){
                    throw new Error(`У вас нет авто с id ${id}`);
                }
                const vehData = allCurrentPlayerVehs.find(playerVeh => playerVeh.vehId === id);
                const result = this.vehiclesManager.checkAllSpawnedVehicles(vehData!.vehId);
                if(!result){
                    this.vehiclesManager.spawnVehicle(player, vehData!);
                    chat.send(player, "Машина успешно заспавнена");
                }
                else{
                    result.pos = player.pos;
                    chat.send(player, "Машина успешно телпортирована");
                }
            } catch (error) {
                chat.send(player,`Произошла  ошибка: ${error}`);
            }

            //this.carShopServer.onSpawnvehAttempt();
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
            if(!this.isValidColorNumber(color1) || !this.isValidColorNumber(color2)){
                chat.send(player, "/color <color1> <color2>");
                chat.send(player, "Цветом может быть только целое число от 0 до 160");
                return;
            }
            if(!player.vehicle){
                chat.send(player, "Для использования команды необходимо находитсья в машине");
                return;
            }
            try {
                const veh = player.vehicle;
                const currentPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
                const ownerId = this.vehiclesManager.getSpawnedVehicleOwnerId(veh);
                if(ownerId === currentPlayerAccountId){
                    veh.primaryColor = color1;
                    veh.secondaryColor = color2;
                    const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
                    this.carShopServer.changeVehColor(vehId!, color1, color2);
                }
                else{
                    chat.send(player, "Вы не являетесь владельцем авто");
                }
            } catch (error) {
                chat.send(player,`Произошла  ошибка: ${error}`);
            }
        });

        chat.registerCmd('sell', async (player: alt.Player) => {
            if(!player.vehicle){
                chat.send(player, "Для использования команды необходимо находитсья в машине");
                return;
            }

            try{
                const veh = player.vehicle;
                const currentPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
                const vehOwnerId = this.vehiclesManager.getSpawnedVehicleOwnerId(veh);
                if(vehOwnerId !== currentPlayerAccountId){
                    throw new Error ("Вы не являетесь владельцем авто");
                }
                const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
                const model = alt.getVehicleModelInfoByHash(veh.model);
                const price = this.carShopServer.findVehPriceInConfig(model.title);
                if (!price){
                    alt.logError("Попытка продать машину которой нет в конфиге model:", model);
                    throw new Error("Машину данной модели нельзя продать");
                }
                if(!currentPlayerAccountId || !vehOwnerId || !vehId){
                    alt.logError(`Не хватает данных currentPlayerAccountId: ${currentPlayerAccountId}, vehOwnerId: ${vehOwnerId}, vehId: ${vehId}`);
                    throw new Error("Произошла непредвиденная ошибка");
                }
                await this.dbServiceManager.transaction(async (trx) => {
                    const currentPlayerMoney = await this.dbServiceManager.account.getMoneyByPrimaryKey(currentPlayerAccountId, trx);
                    if(typeof currentPlayerMoney !== "number"){
                        throw new Error("Не удалось получить кол-во денег на аккаунте");
                    }
                    const resultMoney = currentPlayerMoney + price;
                    await this.dbServiceManager.vehicle.deleteRowByPrimaryKey(vehId, trx);
                    await this.dbServiceManager.account.updateMoneyByPrimaryKey(currentPlayerAccountId, resultMoney, trx);
                });
                this.vehiclesManager.checkVehicleBeforeDestroy(veh);
            }
            catch(error){
                if(error instanceof Error){
                    chat.send(player, `Произошла  ошибка: ${error.message}`);
                }
            }
        });

        chat.registerCmd('inf', async (player: alt.Player) => {
            this.vehiclesManager.printAllSpawnedVehicles();
        });
        // register login password repeat-password

/*         chat.registerCmd('login', (player: alt.Player, login:string, password:string) => {
            //chat.send(player, 'test message with args:');
            try {
                this.databaseService.accountEnter(player, login, password);
            } catch (error) {
                chat.send('Произошла  ошибка:', error);
            }
            chat.send(player, 'Вы успешно вошли в аккаунт');
        }); */
    }

    isValidColorNumber(num: number){
        return Number.isInteger(num) && num >= 0 && num < 161;
    }
}