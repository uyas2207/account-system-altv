import * as alt from 'alt-server';
import { Kysely } from 'kysely';

import { db } from './database/database';
import { Database } from './database/database';
import { CommandManager } from './CommandManager'
import { CarShopServer } from './CarShopServer'
import { AccountManager } from './AccountManager'

import { AccountDBService } from './DataBase classes/AccountDBService';
import { VehicleDBService } from './DataBase classes/VehicletDBService';

import { ConfigManager } from './ConfigManager'
import vehiclesForSale from './config/VehConfig.json' with { type: 'json' };


class StartServer {
    //private readonly databaseService: DatabaseService;
    private readonly accountDBService: AccountDBService;
    private readonly vehicleDBService: VehicleDBService;
    private readonly accoutManager: AccountManager;
    private readonly commandManager: CommandManager;
    private readonly carShopServer: CarShopServer;
    
    //private readonly configManager: ConfigManager;
    constructor()
    {
        //this.databaseService = new DatabaseService(db);
        this.accountDBService = new AccountDBService(db);
        this.vehicleDBService = new VehicleDBService(db);
        this.accoutManager = new AccountManager(this.accountDBService);
        this.carShopServer = new CarShopServer(vehiclesForSale, this.vehicleDBService, this.accoutManager);
        this.commandManager = new CommandManager(this.accoutManager, this.carShopServer);
        //this.configManager = new ConfigManager(vehiclesForSale);
        this.#init();
    }

    #init(){

        alt.on('consoleCommand', async (command, args) => {
            if(command === 'aaa'){
                this.vehicleDBService.deleteRowByPrimaryKey(13);
            }
            if(command === 'bbb'){
                console.log(await this.accountDBService.getRowByPrimaryKey(1));
                console.log(await this.vehicleDBService.getRowByPrimaryKey(14));
            }

            if(command === 'testdb'){
                this.accountDBService.insertNewRow({
                    login: 'playerLogin2',
                    password: 'playerPassword',
                    money: 10000 
                });
            }
            if(command === 'testveh'){
                this.vehicleDBService.insertNewRow({
                    ownerId: 1,
                    model: 123,
                    mainColour: { "r": 0, "g": 255, "b": 0, "a": 255  },
                    secondaryColour: { "r": 0, "g": 255, "b": 0, "a": 255 }
                });
            }
            if(command === "addn"){
                this.vehicleDBService.updateRowByPrimaryKey(13, 'registrationNumber', "A123AA_99");
            }

            if(command === 'delltest'){
                if (args[0] !== undefined){
                    const id = Number (args[0]);
                    const entity = alt.Vehicle.getByID(id);
                    entity?.deleteStreamSyncedMeta('CarForSaleId');
                }
            }

        });
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
            //new alt.Vehicle('adder', -1275.78, -1434.56, 4.54, 0, 0, 0.56621);
            //player.spawn(-1269.91, -1438.64, 4.46);
            player.spawn(-1648.79, -3139.85, 13.98, 4.46);
            alt.emitClient(player, 'carShop:createClientDemonstrationScene', vehiclesForSale);
            //this.carShopServer.sendPlayerCarsForSale(player);
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