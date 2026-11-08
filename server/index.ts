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
import { ConfigValidator } from "./UtilsServer/ConfigValidator";
import { vehiclesForSaleList } from '@shared/SharedConfig'

class CarShopServer {
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
        this.playerVehiclesRepository = new PlayerVehiclesRepository(); //хранит и дает данные о vehicleId vehOwnerId DespawnTimeoutId

        this.spawnedVehsManager = new SpawnedVehsManager(this.playerVehiclesRepository); //действия с машинами игрока как entity: спавн, работа с таймерами на деспавн
        this.accountDBRepository = new AccountDBRepository(db); //взаимодействия с таблицей accounts в бд
        this.vehicleDBRepository = new VehicleDBRepository(db); //взаимодействия с таблицей vehicles в бд
        this.carShopDBIntreractor = new CarShopDBIntreractor(db, this.accountDBRepository, this.vehicleDBRepository) //проведение транзакций в бд при покупке и продаже авто
        this.vehiclesForSaleRegistry = new VehiclesForSaleRegistry(vehiclesForSaleList); //создает машины для продажи по конфигу и взаимодействиует с ними как с entity, проверяет данные в конфиге (изщет price)
        this.accoutManager = new AccountManager(this.accountDBRepository); //(можно потом разбить на репозиторий и мэнеджер) хранит в себе данные о залогиненых игроках и выполняет операции связанные с аккаунтами (вход/выход/регистрация)
        this.vehiclesDataCollector = new VehiclesDataCollector(this.accoutManager, this.vehicleDBRepository, this.vehiclesForSaleRegistry, this.playerVehiclesRepository) //общий класс для определения данных необходимых для работы системы
        this.carShopTradingService = new CarShopTradingService(this.carShopDBIntreractor, this.spawnedVehsManager, this.vehiclesForSaleRegistry, this.vehiclesDataCollector); //выполняет проверки, собирает данные через vehiclesDataCollector и отправляет их на тразакуцию при продаже и покупке (не знаю что с этим классом делать как будто бы надо с каким то другоим объеденить)
        this.playerVehicleService = new PlayerVehicleService(this.vehiclesDataCollector, this.spawnedVehsManager, this.vehicleDBRepository); //действия над машиной которая принадлежит игроку: смена цвета и номерного знака
        this.commandManager = new CommandManager(this.accoutManager, this.carShopTradingService, this.playerVehicleService); //регистрирует команды доступные игроку и обрабатывает корректность значений введенные игроком (ввел число от и до, что ввел целое число и т.д.) передает дальше в соответсвующие классы запросы игрок и выводит игроку текст с результатом его команды 
        
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
    }
    
}

try {
    ConfigValidator.validateConfigs();
    new CarShopServer();
} catch (error) {
    alt.logError("[CarShop] ConfigValidator обнаружил ошибку в заполнении конфига, система продажи авто не запущена");
    alt.logError("[CarShop] Ошибка:", error);
}