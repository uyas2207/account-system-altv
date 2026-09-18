import * as alt from 'alt-server';

import { db } from './database/database';
import { CommandManager } from './CommandManager';
import { CarShopServer } from './CarShopServer';
import { AccountManager } from './AccountManager';
import { SpawnedVehsManager } from './SpawnedVehsManager';

import { AccountDBService } from './DataBase_classes/AccountDBService';
import { VehicleDBService } from './DataBase_classes/VehicletDBService';
import { CarShopDBIntreractor } from "./CarShopClasses/CarShopDBIntreractor";
import { VehiclesForSaleManager } from "./CarShopClasses/VehiclesForSaleManager";
import { VehiclesDataCollector } from "./CarShopClasses/VehiclesDataCollector";

import { vehiclesForSaleList } from '@shared/SharedConfig'

class StartServer {
    private readonly accountDBService: AccountDBService;
    private readonly vehicleDBService: VehicleDBService;
    private readonly carShopDBIntreractor: CarShopDBIntreractor;

    private readonly vehiclesForSaleManager: VehiclesForSaleManager;
    private readonly accoutManager: AccountManager;
    private readonly vehiclesDataCollector: VehiclesDataCollector;
    private readonly commandManager: CommandManager;
    private readonly carShopServer: CarShopServer;
    private readonly spawnedVehsManager: SpawnedVehsManager;


    constructor()
    {
        this.spawnedVehsManager = new SpawnedVehsManager();
        this.accountDBService = new AccountDBService(db);
        this.vehicleDBService = new VehicleDBService(db);
        this.carShopDBIntreractor = new CarShopDBIntreractor(db, this.accountDBService, this.vehicleDBService)
        this.vehiclesForSaleManager = new VehiclesForSaleManager(vehiclesForSaleList);
        this.accoutManager = new AccountManager(this.accountDBService);
        this.vehiclesDataCollector = new VehiclesDataCollector(this.accoutManager, this.vehicleDBService, this.spawnedVehsManager, this.vehiclesForSaleManager)
        this.carShopServer = new CarShopServer(this.vehicleDBService, this.carShopDBIntreractor, this.spawnedVehsManager, this.vehiclesForSaleManager, this.vehiclesDataCollector);
        this.commandManager = new CommandManager(this.accoutManager, this.carShopServer);

        this._init();
    }

    private _init(): void {
        alt.on('resourceStart', async () => {
            try{
                this.vehiclesForSaleManager.createVehiclesForSale();
            }
            catch(error){

            }
        });

        alt.on('playerConnect', async (player) => {
            player.spawn(-1648.79, -3139.85, 13.98, 4.46);
        });

        alt.on('playerDisconnect', async (player, reason) => {
            this.accoutManager.accountExit(player);
        });
    }
    
}

new StartServer;