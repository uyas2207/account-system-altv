import * as alt from 'alt-server';

import { db } from './database/database';
import { CommandManager } from './CommandManager';
import { CarShopServer } from './CarShopServer';
import { AccountManager } from './AccountManager';
import { SpawnedVehsManager } from './SpawnedVehsManager';

import { AccountDBService } from './DataBase_classes/AccountDBService';
import { VehicleDBService } from './DataBase_classes/VehicletDBService';
import { DBTransactionManager } from "./DataBase_classes/DBTransactionManager";

import { vehiclesForSaleList } from '@shared/SharedConfig'

class StartServer {
    private readonly accountDBService: AccountDBService;
    private readonly vehicleDBService: VehicleDBService;
    private readonly DBTransactionManager: DBTransactionManager;

    private readonly accoutManager: AccountManager;
    private readonly commandManager: CommandManager;
    private readonly carShopServer: CarShopServer;
    private readonly spawnedVehsManager: SpawnedVehsManager;

    constructor()
    {
        this.spawnedVehsManager = new SpawnedVehsManager();
        this.accountDBService = new AccountDBService(db);
        this.vehicleDBService = new VehicleDBService(db);
        this.DBTransactionManager = new DBTransactionManager(db, this.accountDBService, this.vehicleDBService);
        this.accoutManager = new AccountManager(this.accountDBService);
        this.carShopServer = new CarShopServer(vehiclesForSaleList, this.vehicleDBService, this.accoutManager);
        this.commandManager = new CommandManager(this.accoutManager, this.carShopServer, this.spawnedVehsManager, this.DBTransactionManager);

        this._init();
    }

    private _init(): void {
        alt.on('resourceStart', async () => {
            this.carShopServer.createVehiclesForSale();
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