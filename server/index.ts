import * as alt from 'alt-server';

import { db } from './database/Database';
import { CommandManager } from './commands/CommandManager';
import { CarShopTradingManager } from './CarShopTradingManager';
import { AccountManager } from './AccountManager';
import { SpawnedVehsManager } from './SpawnedVehsManager';

import { AccountDBRepository } from './dataBaseRepositories/AccountDBRepository';
import { VehicleDBRepository } from './dataBaseRepositories/VehicleDBRepository';
import { CarShopDBIntreractor } from "./CarShopDBIntreractor";
import { VehiclesForSaleManager } from "./VehiclesForSaleManager";
import { VehiclesDataCollector } from "./VehiclesDataCollector";
import { PlayerVehicleService } from './PlayerVehicleService'

import { vehiclesForSaleList } from '@shared/SharedConfig'

class StartServer {
    private readonly accountDBRepository: AccountDBRepository;
    private readonly vehicleDBRepository: VehicleDBRepository;
    private readonly carShopDBIntreractor: CarShopDBIntreractor;

    private readonly vehiclesForSaleManager: VehiclesForSaleManager;
    private readonly accoutManager: AccountManager;
    private readonly vehiclesDataCollector: VehiclesDataCollector;
    private readonly commandManager: CommandManager;
    private readonly CarShopTradingManager: CarShopTradingManager;
    private readonly spawnedVehsManager: SpawnedVehsManager;
    private readonly playerVehicleService: PlayerVehicleService;

    constructor()
    {
        this.spawnedVehsManager = new SpawnedVehsManager();
        this.accountDBRepository = new AccountDBRepository(db);
        this.vehicleDBRepository = new VehicleDBRepository(db);
        this.carShopDBIntreractor = new CarShopDBIntreractor(db, this.accountDBRepository, this.vehicleDBRepository)
        this.vehiclesForSaleManager = new VehiclesForSaleManager(vehiclesForSaleList);
        this.accoutManager = new AccountManager(this.accountDBRepository);
        this.vehiclesDataCollector = new VehiclesDataCollector(this.accoutManager, this.vehicleDBRepository, this.spawnedVehsManager, this.vehiclesForSaleManager)
        this.CarShopTradingManager = new CarShopTradingManager(this.carShopDBIntreractor, this.spawnedVehsManager, this.vehiclesForSaleManager, this.vehiclesDataCollector);        
        this.playerVehicleService = new PlayerVehicleService(this.vehiclesDataCollector, this.spawnedVehsManager, this.vehicleDBRepository);
        this.commandManager = new CommandManager(this.accoutManager, this.CarShopTradingManager, this.playerVehicleService);

        this._init();
    }

    private _init(): void {
        alt.on('resourceStart', async () => {
            this.vehiclesForSaleManager.createVehiclesForSale();
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