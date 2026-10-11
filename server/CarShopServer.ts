import alt from 'alt-server';

import { VehicleDBService } from './DataBase_classes/VehicletDBService'

import { SpawnedVehsManager } from './SpawnedVehsManager'

import { VehiclesForSaleManager } from "./CarShopClasses/VehiclesForSaleManager";
import { VehiclesDataCollector } from "./CarShopClasses/VehiclesDataCollector";
import { CarShopDBIntreractor } from "./CarShopClasses/CarShopDBIntreractor";

import { ClientError } from './ClientError'

export class CarShopServer {
    constructor(
        private readonly vehicleDBService: VehicleDBService,
        private readonly carShopDBIntreractor: CarShopDBIntreractor,
        private readonly vehiclesManager: SpawnedVehsManager,
        private readonly vehiclesForSaleManager: VehiclesForSaleManager,
        private readonly vehiclesDataCollector: VehiclesDataCollector
    ){
    }

    async onCarPurchaseAttempt(player: alt.Player){
        const veh = this.vehiclesDataCollector.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle

        this.vehiclesForSaleManager.checkIsCarForSale(veh);
        const data = this.vehiclesDataCollector.getPlayerVehData(player, veh);
        const vehDBId = await this.carShopDBIntreractor.purchaseVehicleTransaction(data, veh);
        return vehDBId;
        //this.vehiclesForSaleManager.removeCarForSaleSyncedMeta(veh);
    }

    async onCarSellAttempt(player: alt.Player){
        const veh = this.vehiclesDataCollector.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle

        const data = this.vehiclesDataCollector.getPlayerVehData(player, veh);
        const vehOwnerId = this.vehiclesDataCollector.chechkVehicleOwner(player, veh);
        const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);

        if(!vehOwnerId || !vehId){
            throw new Error(`Не хватает данных, vehOwnerId: ${vehOwnerId}, vehId: ${vehId}`);
        }
        const moneyAfterTransaction = await this.carShopDBIntreractor.sellVehicleTransaction(data, vehId);
        this.vehiclesManager.checkVehicleBeforeDestroy(veh);
        return moneyAfterTransaction;
    }
    //как будто бы метод должен относиться к SpawnedVehsManager, но не хотелось бы ради одного метода передавать туда лишние зависимости vehiclesDataCollector
    async onSpawnVehicleAttempt(player: alt.Player, arg: string) {
        const allCurrentPlayerVehs = await this.vehiclesDataCollector.requestVehsByPlayer(player);
        const allVehIds = allCurrentPlayerVehs.map(playerVeh => playerVeh.vehId);
        const id = Number(arg);
        if(!(allVehIds.includes(id))){
            throw new ClientError("У вас нет авто стаким id");
        }
        const vehData = allCurrentPlayerVehs.find(playerVeh => playerVeh.vehId === id);
        if(!vehData){
            throw new Error("Не удалось получить необходимые данные об авто");
        }
        return this.vehiclesManager.getOrSpawnVehicle(player, vehData);
    }
    //спорный момент, но не хотелось передавать лишнюю зависимость в CommandManager
    async requestVehsByPlayer(player: alt.Player){
        return await this.vehiclesDataCollector.requestVehsByPlayer(player);
    }
}