import alt from 'alt-server';

import { SpawnedVehsManager } from './SpawnedVehsManager'
import { VehiclesForSaleRegistry} from "./VehiclesForSaleRegistry";
import { VehiclesDataCollector } from "./VehiclesDataCollector";
import { CarShopDBIntreractor } from "./CarShopDBIntreractor";


export class CarShopTradingService {
    constructor(
        private readonly carShopDBIntreractor: CarShopDBIntreractor,
        private readonly vehiclesManager: SpawnedVehsManager,
        private readonly vehiclesForSaleRegistry: VehiclesForSaleRegistry,
        private readonly vehiclesDataCollector: VehiclesDataCollector
    ){
    }

    async onCarPurchaseAttempt(player: alt.Player){
        const veh = this.vehiclesDataCollector.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicleicle
        this.vehiclesForSaleRegistry.checkIsCarForSale(veh);
        const data = this.vehiclesDataCollector.getPlayerVehData(player, veh);
        
        const vehDBId = await this.carShopDBIntreractor.purchaseVehicleTransaction(data, veh);
        return vehDBId;
        //this.vehiclesForSaleRegistry.removeCarForSaleSyncedMeta(veh);
    }

    async onCarSellAttempt(player: alt.Player){
        const collectedData = this.vehiclesDataCollector.checkVehicleOwnershipAndCollectData(player);
        const data = this.vehiclesDataCollector.getPlayerVehData(player, collectedData.veh);
        
        const moneyAfterTransaction = await this.carShopDBIntreractor.sellVehicleTransaction(data, collectedData.vehId);
        this.vehiclesManager.safeDestroyPlayerVehicle(collectedData.veh);
        return moneyAfterTransaction;
    }

}