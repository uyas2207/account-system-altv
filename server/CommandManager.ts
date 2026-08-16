import * as alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

import { DatabaseService } from './DatabaseService'
import { CarShopServer } from './CarShopServer'

export class CommandManager {
    constructor(
        private readonly databaseService: DatabaseService,
        private readonly carShopServer: CarShopServer,
    ){
        this.#init();
    }

    #init(){
        alt.on('consoleCommand', (command, ...args) => {
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
        });
    
        chat.registerCmd('buy', (player: alt.Player) => {
            //chat.send(player, 'test message with args:');
            this.carShopServer.onCarPurchaseAttempt(player);
        });

        chat.registerCmd('login', (player: alt.Player, login:string, password:string) => {
            //chat.send(player, 'test message with args:');
            try {
                this.databaseService.accountEnter(player, login, password);
            } catch (error) {
                chat.send('Произошла  ошибка:', error);
            }
            chat.send(player, 'Вы успешно вошли в аккаунт');
        });
    }
}