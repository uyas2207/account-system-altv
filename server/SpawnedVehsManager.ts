import alt from 'alt-server';

import { Vehicles } from './Database/Database'
import { defaultParameters } from './Config/ServerConfig'
import { PlayerVehiclesRepository } from './SrverDataRepositories/PlayerVehiclesRepository';

import { wait } from "@shared/UtilsShared/UtilitiesShared";

export class SpawnedVehsManager {
    constructor( 
        private readonly playerVehiclesRepository: PlayerVehiclesRepository
    ){
        this._registerEventListeners();
    }

    private _registerEventListeners(): void{
        alt.on("playerEnteredVehicle", async (player, veh) => {
            if(!this.playerVehiclesRepository.hasVeh(veh)) return;
            this._stopVehicleDespawnTimeout(veh);
        });

        //при дисконкте игрока ивент на playerLeftVehicle автоматически происходит
        alt.on("playerLeftVehicle", async (player, veh) => {
            if(!this.playerVehiclesRepository.hasVeh(veh) || Object.keys(veh.passengers).length !== 0) return; //игрок за рулем тоже входит в passengers
            const despawnTimeoutId = this._createVehicleDespawnTimeout(veh);
            if(!despawnTimeoutId){ 
                alt.logError("Не удалось создать DespawnTimeout");
                return;
            }
            this.playerVehiclesRepository.addVehDespawnTimeoutId(veh, despawnTimeoutId);
        });

        alt.on("vehicleDestroy", async (veh) => {
            if(!this.playerVehiclesRepository.hasVeh(veh)) return;
            await wait(2000);    //что бы машина удалялась после анимации со взрывом а не сразу
            this._stopVehicleDespawnTimeout(veh);
            this._destroyVehicleAndRemoveVehFromMap(veh);
        });
    
    }

    getOrSpawnVehicle(player: alt.Player, vehData: Vehicles): boolean {
        const veh = this.playerVehiclesRepository.checkallSpawnedVehiclesByVehId(vehData.vehId);
        if(!veh){
            this._spawnVehicle(player, vehData);
            return true;
        }
        else{
            veh.pos = player.pos;
            return false;
        }
    }

    private _createVehicleDespawnTimeout(veh: alt.Vehicle){
        if(this.playerVehiclesRepository.getVehDespawnTimeoutId(veh)) {
            alt.logError("Нельзя создавать VehicleDespawnTimeout для машины на кототорой уже существует VehicleDespawnTimeout");
            return;
        }

        const despawnTimeoutId = alt.setTimeout(() => {
            this._destroyVehicleAndRemoveVehFromMap(veh);
        }, defaultParameters.defaultDespawnTimer);//120000
        
        return despawnTimeoutId;
    }

    private async _stopVehicleDespawnTimeout(veh: alt.Vehicle): Promise<void>{
        const despawnTimeoutId = this.playerVehiclesRepository.getVehDespawnTimeoutId(veh);
        if(despawnTimeoutId){
            alt.clearTimeout(despawnTimeoutId);
            this.playerVehiclesRepository.clearVehDespawnTimeoutId(veh);
        }
    }
    
    private _destroyVehicleAndRemoveVehFromMap(veh: alt.Vehicle): void{
        this.playerVehiclesRepository.deleteVeh(veh);
        veh.destroy();
    }

    private _spawnVehicle(player: alt.Player, vehData: Vehicles): void{
        const veh = new alt.Vehicle(vehData.model, player.pos, player.rot);
        veh.primaryColor = vehData.primaryColor;
        veh.secondaryColor = vehData.secondaryColor;
        veh.numberPlateText = vehData.registrationNumber ?? "_";
        const despawnTimeoutId = this._createVehicleDespawnTimeout(veh);

        const spawnedVehicleData = {
            vehicleId:  vehData.vehId,
            vehOwnerId: vehData.ownerId,
            DespawnTimeoutId: despawnTimeoutId ?? null
        };

        this.playerVehiclesRepository.setVeh(veh, spawnedVehicleData);
    }
}