import alt from 'alt-server';

import { SpawnedVehsManager } from './SpawnedVehsManager'
import { VehiclesForSaleManager } from "./VehiclesForSaleManager";
import { VehiclesDataCollector } from "./VehiclesDataCollector";
import { CarShopDBIntreractor } from "./CarShopDBIntreractor";


export class CarShopTradingManager {
    constructor(
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
        const collectedData = this.vehiclesDataCollector.checkVehicleOwnershipAndCollectData(player);
        const data = this.vehiclesDataCollector.getPlayerVehData(player, collectedData.veh);
        
        const moneyAfterTransaction = await this.carShopDBIntreractor.sellVehicleTransaction(data, collectedData.vehId);
        this.vehiclesManager.checkVehicleBeforeDestroy(collectedData.veh);
        return moneyAfterTransaction;
    }

}