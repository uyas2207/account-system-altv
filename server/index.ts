import * as alt from 'alt-server';

import { db } from './Database/Database';
import { CommandManager } from './Commands/CommandManager';
import { CarShopTradingService } from './CarShopTradingService';
import { AccountManager } from './AccountManager';
import { SpawnedVehsManager } from './SpawnedVehsManager';

import { AccountDBRepository } from './DataBaseRepositories/AccountDBRepository';
import { VehicleDBRepository } from './DataBaseRepositories/VehicleDBRepository';
import { CarShopDBIntreractor } from "./CarShopDBIntreractor";
import { VehiclesForSaleRegistry} from "./VehiclesForSaleRegistry";
import { VehiclesDataCollector } from "./VehiclesDataCollector";
import { PlayerVehicleService } from './PlayerVehicleService'

import { PlayerVehiclesRepository } from "./SrverDataRepositories/PlayerVehiclesRepository";

import { vehiclesForSaleList } from '@shared/SharedConfig'

class StartServer {
    private readonly accountDBRepository: AccountDBRepository;
    private readonly vehicleDBRepository: VehicleDBRepository;
    private readonly carShopDBIntreractor: CarShopDBIntreractor;

    private readonly vehiclesForSaleRegistry: VehiclesForSaleRegistry;
    private readonly accoutManager: AccountManager;
    private readonly vehiclesDataCollector: VehiclesDataCollector;
    private readonly commandManager: CommandManager;
    private readonly carShopTradingService: CarShopTradingService;
    private readonly spawnedVehsManager: SpawnedVehsManager;
    private readonly playerVehicleService: PlayerVehicleService;

    private readonly playerVehiclesRepository: PlayerVehiclesRepository;
    constructor()
    {
        this.playerVehiclesRepository = new PlayerVehiclesRepository();
        this.spawnedVehsManager = new SpawnedVehsManager(this.playerVehiclesRepository);
        this.accountDBRepository = new AccountDBRepository(db);
        this.vehicleDBRepository = new VehicleDBRepository(db);
        this.carShopDBIntreractor = new CarShopDBIntreractor(db, this.accountDBRepository, this.vehicleDBRepository)
        this.vehiclesForSaleRegistry= new VehiclesForSaleRegistry(vehiclesForSaleList);
        this.accoutManager = new AccountManager(this.accountDBRepository);
        this.vehiclesDataCollector = new VehiclesDataCollector(this.accoutManager, this.vehicleDBRepository, this.spawnedVehsManager, this.vehiclesForSaleRegistry)
        this.carShopTradingService = new CarShopTradingService(this.carShopDBIntreractor, this.spawnedVehsManager, this.vehiclesForSaleRegistry, this.vehiclesDataCollector);        
        this.playerVehicleService = new PlayerVehicleService(this.vehiclesDataCollector, this.spawnedVehsManager, this.vehicleDBRepository);
        this.commandManager = new CommandManager(this.accoutManager, this.carShopTradingService, this.playerVehicleService);

        this._init();
    }

    private _init(): void {
        alt.on('resourceStart', async () => {
            this.vehiclesForSaleRegistry.createVehiclesForSale();
        });

        alt.on('playerConnect', async (player) => {
            player.spawn(-1648.79, -3139.85, 13.98, 4.46);
        });

        alt.on('playerDisconnect', async (player, reason) => {
            this.accoutManager.accountExit(player);
        });

        const id = alt.setTimeout(() => {
            console.log("asd");
        }, 20000);
        console.log("id", id);
    }
    
}

new StartServer;