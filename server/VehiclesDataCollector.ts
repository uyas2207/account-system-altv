import alt from 'alt-server';

import { AccountManager } from './AccountManager'
import { VehicleDBRepository } from './DataBaseRepositories/VehicleDBRepository'
import { VehiclesForSaleRegistry} from "./VehiclesForSaleRegistry";

import { SpawnedVehsManager } from "./SpawnedVehsManager";

import { Vehicles } from './Database/Database'
import { IVehData } from "./Config/Types/IVehData";

import { ClientError } from './Errors/ClientError'

export class VehiclesDataCollector {
    constructor(
        private readonly accoutManager: AccountManager,
        private readonly vehicleDBRepository: VehicleDBRepository,
        private readonly vehiclesManager: SpawnedVehsManager,
        private readonly vehiclesForSaleRegistry: VehiclesForSaleRegistry
    ){
    }

    checkVehicleOwnershipAndCollectData(player: alt.Player){
        const veh = this.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.veh
        this.chechkVehicleOwner(player, veh);   //если игрок не владелец авто будет Error, если владелец вернет вернет vehOwnerId
        const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
        if(!vehId){
            throw new Error("Произошла ошибка при получении данных машины");
        }
        return {veh, vehId};
    }

    getPlayerVehData(player: alt.Player, veh: alt.Vehicle): IVehData {
        const accountId = this.accoutManager.requestPlayerAccountId(player);
        const model = (alt.getVehicleModelInfoByHash(veh.model).title);
        const price = this.vehiclesForSaleRegistry.findVehPriceInConfig(model);

        //пытался вынести проверку в findVehPriceInConfig, но ts выдавал ошибку поэтому проверка тут
        if(!price){
            alt.logError("Попытка купить машину которой нет в конфиге model:", model);
            throw new Error("Нет корректной цены у машины");  
        }
        return({ accountId, model, price});
    }

    async requestVehsByPlayer(player: alt.Player): Promise<Vehicles[]> {
        const currentPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
        const allvehs = await this.vehicleDBRepository.getAllVehsByAccountId(currentPlayerAccountId);
        return allvehs;
    }

    async requestVehsByVehId(player: alt.Player, vehId: number){
        const currentPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
        const vehData = await this.vehicleDBRepository.getVehicleByVehIdAndOwnerId(currentPlayerAccountId, vehId);
        if(!vehData){
            throw new ClientError(`У вас нет машины с ID ${vehId}`);
        }
        return vehData;
    }

    chechkVehicleOwner(player: alt.Player, veh: alt.Vehicle): number{
        const accountId = this.accoutManager.requestPlayerAccountId(player);
        const vehOwnerId = this.vehiclesManager.getSpawnedVehicleOwnerId(veh);
        if(accountId !== vehOwnerId){
            throw new ClientError("Вы не являетесь владельцем авто");
        }
        return accountId;//нет смысла возврщать и accountId и vehOwnerId так как они прошли проверку => одинаковые
    }

    //если игрок не в авто Error, если в авто вернет player.veh
    checkIsPlayerInVehicle(player: alt.Player): alt.Vehicle {
        const veh = player.veh;
        if(!veh){
            throw new ClientError("Для использования команды необходимо находитсья в машине");
        }
        return veh;
    }
    
}