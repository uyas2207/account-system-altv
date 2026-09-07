import * as alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

/* import { DatabaseService } from './DatabaseService' */
import { CarShopServer } from './CarShopServer'
import { AccountManager } from './AccountManager'

export class CommandManager {
    constructor(
        private readonly accoutManager: AccountManager, 
        private readonly carShopServer: CarShopServer,
    ){
        this.#init();
    }

    #init(){
/*         alt.on('consoleCommand', (command, ...args) => {
            if(command === 'checkAccountLogin'){
                const playerLogin = String (args[0] ?? null);
                
                this.databaseService.checkAccountLogin(playerLogin);
            }
            if(command === 'testEnter'){
                const playerLogin = String (args[0] ?? null);
                const playerPassword = String (args[1] ?? null);

                //this.databaseService.accountEnter(playerLogin, playerPassword);
            }
            if( command === 'testRegister'){
                const playerLogin = String (args[0] ?? null);
                const playerPassword = String (args[1] ?? null);
                const playerRepeatPassword = String (args[2] ?? null);
                try {
                    this.databaseService.registration(playerLogin, playerPassword, playerRepeatPassword)
                } catch (error) {
                    alt.logError('Произошла  ошибка:', error);
                }
            }
            if (command === 'printPlayers'){
                this.databaseService.printPlayers();
            }
            if (command === 'printVehicles'){
                this.databaseService.printVehicles();
            }
            if(command === 'testAddVehicle'){
                const ownerId = Number (args[0] ?? null);
                const model = String (args[1] ?? null);
                const mainColour = String (args[2] ?? null);
                const secondaryColour = String (args[3] ?? null);
                const registrationNumber = String (args[5] ?? 'empty');
                //для тестов, потом нужно убрать
                if (!ownerId || !model || !mainColour || !secondaryColour){
                    console.log('Некорректные данные');
                    return;
                }
                this.databaseService.vehicleDataValidation(ownerId, model, mainColour, secondaryColour, registrationNumber);
                //this.databaseService.testAddVehicle(ownerId, model, mainColour, secondaryColour, registrationNumber);
            }

            if(command === 'marker'){
        
            }
        }); */
    
        chat.registerCmd('buy', async (player: alt.Player) => {
            try {
                this.carShopServer.onCarPurchaseAttempt(player);
            } catch (error) {
                chat.send(player,'Произошла  ошибка:', error);
            }
            //chat.send(player, 'test message with args:');
            //this.carShopServer.onCarPurchaseAttempt(player);
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
            console.log('args[0], args[1]', args[0], args[1]);
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
        chat.registerCmd('myvehs', (player: alt.Player) => {
            try {
                const currentPlayerAccountId = this.accoutManager.onAccountVehsAttempt(player);

                this.carShopServer
            } catch (error) {
                
            }
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
}