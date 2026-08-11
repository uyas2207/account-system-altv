import * as alt from 'alt-server';
import { Kysely } from 'kysely';

import { db } from '../src/database';
import { Database } from '../src/database';
import { DatabaseService } from './DatabaseService'
import { CommandManager } from './CommandManager'
import { CarShopServer } from './CarShopServer'

import vehiclesForSale from './config/VehConfig.json' with { type: 'json' };


class StartServer {
    private readonly databaseService: DatabaseService;
    private readonly commandManager: CommandManager;
    private readonly carShopServer: CarShopServer;
    
    constructor()
    {
        this.databaseService = new DatabaseService(db);
        this.commandManager = new CommandManager(this.databaseService);
        this.carShopServer = new CarShopServer(vehiclesForSale);
        this.#init();
    }

    #init(){
/*             const result = VEHICLE_MODELS.includes('benson');
            console.log('result', result); */
/*         alt.on('consoleCommand', (command, ...args) => {
            if(command === 'checkAccountLogin'){
                const playerLogin = String (args[0] ?? null);
                
                this.databaseService.checkAccountLogin(playerLogin);
            }
            if(command === 'testEnter'){
                const playerLogin = String (args[0] ?? null);
                const playerPassword = String (args[1] ?? null);

                this.databaseService.accountEnter(playerLogin, playerPassword);
            }
            if( command === 'testRegister'){
                const playerLogin = String (args[0] ?? null);
                const playerPassword = String (args[1] ?? null);
                const playerRepeatPassword = String (args[2] ?? null);

                this.databaseService.registration(playerLogin, playerPassword, playerRepeatPassword)
            }
            if (command === '#printPlayers'){
                this.databaseService.printPlayers();
            }
            if (command === '#printVehicles'){
                this.databaseService.printVehicles();
            }
            if(command === 'testAddVehicle'){
                const ownerId = Number (args[0] ?? null);
                const model = String (args[1] ?? null);
                const mainColour = String (args[2] ?? null);
                const secondaryColour = String (args[3] ?? null);
                const registrationNumber = String (args[5] ?? 'empty');
                
                if (!ownerId || !model || !mainColour || !secondaryColour){
                    console.log('Некорректные данные');
                    return;
                }
                this.databaseService.testAddVehicle(ownerId, model, mainColour, secondaryColour, registrationNumber);
            }
        }); */
    
        alt.on('resourceStart', async () => {
            this.carShopServer.createDemonstrationScene();
        });

        alt.on('playerConnect', async (player) => {
            player.spawn(-1648.79, -3139.85, 13.98, 4.46);
        });
    }

    
}

new StartServer;

/* sp	-1648.79, -3139.85, 13.98

Position: -1641.80, -3173.96, 13.98	r 0.99


Position: -1653.32, -3182.40, 13.98	r -0.54
"x": -1653.32, "y": 3182.40, "z": 13.98, "rx": 0.0, "ry": 0.0, "rz": -0.54,

Position: -1659.27, -3178.36, 13.98	r -0.45 +- -0.54

Position: -1666.10, -3174.30, 13.98	r -0.45 +- -0.54

Position: -1675.67, -3166.40, 13.98	r -0.45 +- -0.54

 Position: -1682.44, -3162.03, 13.98	r -0.45 +- -0.54

 */