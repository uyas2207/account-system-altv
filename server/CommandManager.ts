import * as alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

import { CarShopServer } from './CarShopServer'
import { AccountManager } from './AccountManager'
import { SpawnedVehsManager } from './SpawnedVehsManager'



export class CommandManager {
    constructor(
        private readonly accoutManager: AccountManager, 
        private readonly carShopServer: CarShopServer,
        private readonly vehiclesManager: SpawnedVehsManager
    ){
        this._registerCommands();
    }

    private _registerCommands(): void {

        chat.registerCmd('buy', async (player: alt.Player) => {
            try {
                const veh = this._checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
                const vehDBId = await this.carShopServer.purchaseVehicle(player, veh);
                chat.send(player, `Машина успешно куплена, id машины: ${vehDBId}`);
            //    if(vehDBId) {
            //        const id = Number(vehDBId[0]!.insertId);
            //        this.vehiclesManager.addVehicle(id, veh, data.accountId, false);
            //    }
            } catch (error) {
                this._sendErrorToPlayer(player, error);
            }
        });

        chat.registerCmd('sell', async (player: alt.Player) => {
            try{
                const veh = this._checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
                await this.carShopServer.sellVehicle(player, veh);
            }
            catch(error){
                this._sendErrorToPlayer(player, error);
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
                this._sendErrorToPlayer(player, error);
            }
        });
        // login login password
        chat.registerCmd('login', async (player: alt.Player, args: Array<string>) => {
            const login = args[0]
            const password = args[1];
            
            if(!login || !password){
                chat.send(player,"/login <login> <password>");
                chat.send(player,"Не введены значения password или login");
                return;
            }
            try {
                await this.accoutManager.onAccountEnterAttempt(player, login, password);
                chat.send(player,'Вы успешно вошли в аккаунт');
            } catch (error) {
                this._sendErrorToPlayer(player, error);
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
                this._sendErrorToPlayer(player, error);
            }
        });
        //spawnveh ID
        chat.registerCmd('spawnveh', async (player: alt.Player, args: Array<string>) => {
            const vehDBId = args[0];
            
            if(!vehDBId){
                chat.send(player,"/spawnveh <ID>");
                chat.send(player,"Не введено значение ID");
                return;
            }
            
            try {
                await this._onSpawnVehicleAttempt(player, vehDBId);
            } catch (error) {
                this._sendErrorToPlayer(player, error);
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
                this.carShopServer.chechkVehicleOwner(player, veh);   //если игрок не владелец авто будет Error, если владелец вернет вернет vehOwnerId
                const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
                if(!vehId){
                    throw new Error("Произошла ошибка при получении данных машины");
                }
                await this.carShopServer.changeVehColor(vehId, veh, color1, color2);
            } catch (error) {
                this._sendErrorToPlayer(player, error);
            }
        });

        chat.registerCmd('logout', (player: alt.Player) => {
            this.accoutManager.accountExit(player);
        });

        chat.registerCmd('nameplate', async (player: alt.Player, args: Array<string>) => {
            const text = args[0];
            if(!text || text.length > 7){
                chat.send(player,"/nameplate <nameplate_text>");
                chat.send(player,"Длинна текста должна быть больше 0 и меньше 7 символов");
                return;
            }
            try {
                const veh = this._checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
                this.carShopServer.chechkVehicleOwner(player, veh);   //если игрок не владелец авто будет Error, если владелец вернет вернет vehOwnerId
                const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
                if(!vehId){
                    throw new Error("Произошла ошибка при получении данных машины");
                }
                await this.carShopServer.ChangeVehNuberPlate(vehId, veh, text);
            } catch (error) {
                this._sendErrorToPlayer(player, error);
            }
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
        const result = this.vehiclesManager.getOrSpawnVehicle(player, vehData);
        if(result){
            chat.send(player, "Машина успешно заспавнена");
        }
        else{
            chat.send(player, "Машина успешно телпортирована");
        }
    }

    //ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    //для проверки что цвет число и входит в список цветов altv

    //если игрок не в авто Error, если в авто вернет player.vehicle
    private _checkIsPlayerInVehicle(player: alt.Player): alt.Vehicle {
        const veh = player.vehicle;
        if(!veh){
            throw new Error("Для использования команды необходимо находитсья в машине");
        }
        return veh;
    }
    
    private _isValidColorNumber(num: number): boolean {
        return Number.isInteger(num) && num >= 0 && num < 161;
    }

    private _sendErrorToPlayer(player: alt.Player, error: unknown){
        if(error instanceof Error){
            const text = this._checkErrorType(error.message);
            chat.send(player, text);
        }
        else{
            alt.logError("Произошла ошибка в try, но не instanceof Error");
        }
    }

    private _checkErrorType(text: string){
        switch (true) {
            case text.includes("connect"): return "Ошибка с подключением к БД";
            case text.includes("Duplicate entry"): return "Данное значение недоступно";
            default: return text;
        }
    }
}