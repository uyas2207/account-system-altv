import alt from 'alt-server';

import { Vehicles } from './database/database'
import{ defaultParameters } from './config/ServerConfig'

interface ISpawnedVehicleData {
    vehicleId: number;
    vehOwnerId: number;
    TimeoutId: number | null;
}

export class SpawnedVehsManager {
    private readonly allSpawnedVehicles: Map <alt.Vehicle, ISpawnedVehicleData> = new Map <alt.Vehicle, ISpawnedVehicleData>();

    constructor(){
        this._registerEventListeners();
    }

    private _registerEventListeners(): void{
        alt.on("playerEnteredVehicle", async (player, vehicle) => {
            if(this.allSpawnedVehicles.has(vehicle)){
                const mapData = this.allSpawnedVehicles.get(vehicle);
                if(mapData?.TimeoutId){
                    alt.clearTimeout(mapData.TimeoutId);
                    mapData.TimeoutId = null;
                }
            }
        });
        //при дисконкте игрока ивент на playerLeftVehicle автоматически происходит
        alt.on("playerLeftVehicle", async (player, vehicle) => {
            if(this.allSpawnedVehicles.has(vehicle) && Object.keys(vehicle.passengers).length === 0){ //игрок за рулем тоже входит в passengers
                const mapData = this.allSpawnedVehicles.get(vehicle);
                if(!mapData){
                    alt.logError("[SpawnedVehsManager] не удалось получить mapData по vehicle.id =", vehicle.id)
                    return;
                }
                if(!(mapData?.TimeoutId)){
                    const despawnTimeoutId = alt.setTimeout(() => {
                        this._destroyVehicleAndRemoveVehFromMap(vehicle);
                    }, defaultParameters.defaultDespawnTimer );//120000
                    mapData.TimeoutId = despawnTimeoutId;
                }
            }
        });
        
        alt.on("vehicleDestroy", async (vehicle) => {
            this.checkVehicleBeforeDestroy(vehicle, true);
        });
    }

    getOrSpawnVehicle(player: alt.Player, vehData: Vehicles): boolean {
        const vehicle = this.checkAllSpawnedVehicles(vehData.vehId);
        if(!vehicle){
            this._spawnVehicle(player, vehData!);
            return true;
        }
        else{
            vehicle.pos = player.pos;
            return false;
        }
    }

    async checkVehicleBeforeDestroy(vehicle: alt.Vehicle, awaitTimer = false): Promise<void>{
        if(this.allSpawnedVehicles.has(vehicle)){
            const mapData = this.allSpawnedVehicles.get(vehicle);
            if(mapData?.TimeoutId){
                alt.clearTimeout(mapData.TimeoutId);
            }
            if(awaitTimer){
                await new Promise(resolve => alt.setTimeout(resolve, 2000)); //что бы машина удалялась после анимации со взрывом а не сразу
            }
            this._destroyVehicleAndRemoveVehFromMap(vehicle);
        }
    }

    checkAllSpawnedVehicles(vehId: number): alt.Vehicle | undefined {
        for (const [key, value] of this.allSpawnedVehicles) {
            if(value.vehicleId === vehId){
                return key;
            }
        }
    }

    getSpawnedVehicleOwnerId(veh: alt.Vehicle): number | undefined {
        return this.allSpawnedVehicles.get(veh)?.vehOwnerId;
    }

    getSpawnedVehicleId(veh: alt.Vehicle): number | undefined {
        return this.allSpawnedVehicles.get(veh)?.vehicleId;
    }

    private _spawnVehicle(player: alt.Player, vehData: Vehicles): void{
        //проверка нужна если в будущем кто то будет вызывать метод spawnVehicle без проверки (по итогу получается что проверка два раза происходит в getOrSpawnVehicle и тут)
        if (!(this.checkAllSpawnedVehicles(vehData.vehId))){
            const veh = new alt.Vehicle(vehData.model, player.pos, player.rot);
            veh.primaryColor = vehData.primaryColor;
            veh.secondaryColor = vehData.secondaryColor;
            veh.numberPlateText = vehData.registrationNumber ?? "_";
            this._addVehicle(vehData.vehId, veh, vehData.ownerId);
        }
        else{
            throw new Error("Попытка заспавнить же существующий транспорт");
        }
    }

    private _addVehicle(vehId: number, veh: alt.Vehicle, accountId: number, addDestroy = true): void{
        let despawnTimeoutId = null;

        if(addDestroy){
            despawnTimeoutId = alt.setTimeout(() => {
                this._destroyVehicleAndRemoveVehFromMap(veh);
            }, defaultParameters.defaultDespawnTimer);//120000
        }
        this.allSpawnedVehicles.set(veh, { vehicleId: vehId, vehOwnerId: accountId, TimeoutId: despawnTimeoutId });
    }
    
    private _destroyVehicleAndRemoveVehFromMap(veh: alt.Vehicle): void{
        this.allSpawnedVehicles.delete(veh);
        veh.destroy();
    }
}