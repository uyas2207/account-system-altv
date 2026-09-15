import alt from 'alt-server';

import { Vehicles } from './database/database'
import{ defaultParameters } from './config/VehConfig'

interface IVehicleData {
    vehicleId: number;
    vehOwnerId: number;
    TimeoutId: number | null;
}

export class SpawnedVehsManager {
    private readonly allSpawnedVehicles: Map <alt.Vehicle, IVehicleData> = new Map <alt.Vehicle, IVehicleData>();

    constructor(){
        this._registerEventListeners();
    }

    private _registerEventListeners(): void{
        alt.on("playerEnteredVehicle", async (player, vehicle) => {
            if(this.allSpawnedVehicles.has(vehicle)){
                const mapData = this.allSpawnedVehicles.get(vehicle);
                if(mapData?.TimeoutId){
                    alt.clearTimeout(mapData.TimeoutId);
                    this.allSpawnedVehicles.set(vehicle, { vehicleId: mapData!.vehicleId, vehOwnerId: mapData.vehOwnerId, TimeoutId: null });
                }
            }
        });

        alt.on("playerLeftVehicle", async (player, vehicle) => {
            if(this.allSpawnedVehicles.has(vehicle)){
                const mapData = this.allSpawnedVehicles.get(vehicle);
                if(!(mapData?.TimeoutId)){
                    const despawnTimeoutId = alt.setTimeout(() => {
                        this.destroyVehicleOnTimer(vehicle);
                    }, defaultParameters.defaultDespawnTimer );//120000
                    this.allSpawnedVehicles.set(vehicle, { vehicleId: mapData!.vehicleId, vehOwnerId: mapData!.vehOwnerId, TimeoutId: despawnTimeoutId });
                }
            }
        });
        
        alt.on("vehicleDestroy", async (vehicle) => {
            this.checkVehicleBeforeDestroy(vehicle);
        });
    }

    addVehicle(vehId: number, veh: alt.Vehicle, accountId: number, addDestroy = true): void{
        let despawnTimeoutId = null;

        if(addDestroy){
            despawnTimeoutId = alt.setTimeout(() => {
                this.destroyVehicleOnTimer(veh);
            }, defaultParameters.defaultDespawnTimer);//120000
        }
        this.allSpawnedVehicles.set(veh, { vehicleId: vehId, vehOwnerId: accountId, TimeoutId: despawnTimeoutId });
    }

    spawnVehicle(player: alt.Player, vehData: Vehicles): void{
        if (!(this.checkAllSpawnedVehicles(vehData.vehId))){
            const veh = new alt.Vehicle(vehData.model, player.pos, player.rot);
            veh.primaryColor = vehData.primaryColor;
            veh.secondaryColor = vehData.secondaryColor;
            veh.numberPlateText = vehData.registrationNumber ?? "_";
            this.addVehicle(vehData.vehId, veh, vehData.ownerId);
        }
        else{
            throw new Error("Попытка заспавнить же существующий транспорт");
        }
    }

    checkVehicleBeforeDestroy(vehicle: alt.Vehicle): void{
        if(this.allSpawnedVehicles.has(vehicle)){
            const mapData = this.allSpawnedVehicles.get(vehicle);
            if(mapData?.TimeoutId){
                alt.clearTimeout(mapData.TimeoutId);
            }
            this.destroyVehicleOnTimer(vehicle);
        }
    }

    destroyVehicleOnTimer(veh: alt.Vehicle): void{
        this.allSpawnedVehicles.delete(veh);
        veh.destroy();
    }

    checkAllSpawnedVehicles(vehId: number): alt.Vehicle | undefined {
        for (const [key, value] of this.allSpawnedVehicles) {
            if(value.vehicleId === vehId){
                return key;
            }
        }
    }

    changeVehicleColor(veh: alt.Vehicle, color1: number, color2: number): void{
        veh.primaryColor = color1;
        veh.secondaryColor = color2;
    }

    getSpawnedVehicleOwnerId(veh: alt.Vehicle): number | undefined {
        return this.allSpawnedVehicles.get(veh)?.vehOwnerId;
    }

    getSpawnedVehicleId(veh: alt.Vehicle):  number | undefined {
        return this.allSpawnedVehicles.get(veh)?.vehicleId;
    }
}