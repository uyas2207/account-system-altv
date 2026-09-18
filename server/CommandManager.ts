import * as alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

import { CarShopServer } from './CarShopServer'
import { AccountManager } from './AccountManager'

export class CommandManager {
    constructor(
        private readonly accoutManager: AccountManager, 
        private readonly carShopServer: CarShopServer
    ){
        this._registerCommands();
    }

    private _registerCommands(): void {

        chat.registerCmd('buy', async (player: alt.Player) => {
            try {
                const vehDBId = await this.carShopServer.onCarPurchaseAttempt(player);
                chat.send(player, `Машина успешно куплена, id машины: ${vehDBId}`);
            } catch (error) {
                this._sendErrorToPlayer(player, error);
            }
        });

        chat.registerCmd('sell', async (player: alt.Player) => {
            try{
                const resultMoney = await this.carShopServer.onCarSellAttempt(player);
                chat.send(player,`Вы успешно продали машину, денег на вашем аккаунте после продажи ${resultMoney}`);
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
                chat.send(player,"Список машин на вашем аккаунте:");
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
                const result = await this.carShopServer.onSpawnVehicleAttempt(player, vehDBId);
                if(result){
                    chat.send(player, "Машина успешно заспавнена");
                }
                else{
                    chat.send(player, "Машина успешно телпортирована");
                }
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
                await this.carShopServer.onChangeColorAttempt(player, color1, color2);
                chat.send(player,"Вы успешно сменили цвет авто");
            } catch (error) {
                this._sendErrorToPlayer(player, error);
            }
        });

        chat.registerCmd('logout', (player: alt.Player) => {
            this.accoutManager.accountExit(player);
        });

        chat.registerCmd('numberplate', async (player: alt.Player, args: Array<string>) => {
            const text = args[0];
            if(!text || text.length > 7){
                chat.send(player,"/numberplate <numberplate_text>");
                chat.send(player,"Длинна текста должна быть больше 0 и меньше 7 символов");
                return;
            }
            try {
                await this.carShopServer.onChangeNumberPlateAttempt(player, text);
                chat.send(player,`Вы успешно поменяли Номерной знак на ${text}`);
            } catch (error) {
                this._sendErrorToPlayer(player, error);
            }
        });
    }
    //ДОПОЛНИТЕЛЬНЫЕ, ВСПОМОГАТНЛЬНЫЕ МЕТОДЫ
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