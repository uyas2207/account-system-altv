import alt from 'alt-server';

import { Vehicles } from './database/database'

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

    private _registerEventListeners(){
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
                    }, 10000);//120000
                    this.allSpawnedVehicles.set(vehicle, { vehicleId: mapData!.vehicleId, vehOwnerId: mapData!.vehOwnerId, TimeoutId: despawnTimeoutId });
                }
            }
        });
        
        alt.on("vehicleDestroy", async (vehicle) => {
            this.checkVehicleBeforeDestroy(vehicle);
/*             console.log("ON VEHICLE DESTROY");
            if(this.allSpawnedVehicles.has(vehicle)){
                const mapData = this.allSpawnedVehicles.get(vehicle);
                if(mapData?.TimeoutId){
                    alt.clearTimeout(mapData.TimeoutId);
                }
                this.allSpawnedVehicles.delete(vehicle);
                console.log("Удален vehicle из MAP");
            } */
        });
    }

    addVehicle(vehId: number, veh: alt.Vehicle, accountId: number, addDestroy = true){
        console.log('addVehicle');
        let despawnTimeoutId = null;

        if(addDestroy){
            despawnTimeoutId = alt.setTimeout(() => {
                this.destroyVehicleOnTimer(veh);
            }, 10000);//120000
        }
        this.allSpawnedVehicles.set(veh, { vehicleId: vehId, vehOwnerId: accountId, TimeoutId: despawnTimeoutId });
    }

    spawnVehicle(player: alt.Player, vehData: Vehicles){
        console.log('spawnVehicle');
        if (!(this.checkAllSpawnedVehicles(vehData.vehId))){
            const veh = new alt.Vehicle(vehData.model, player.pos, player.rot);
            veh.primaryColor = vehData.primaryColor;
            veh.secondaryColor = vehData.secondaryColor;
            veh.numberPlateText = vehData.registrationNumber ?? "";
            this.addVehicle(vehData.vehId, veh, vehData.ownerId);
        }
        else{
            throw new Error("Попытка заспавнить же существующий транспорт");
        }
    }

    checkVehicleBeforeDestroy(vehicle: alt.Vehicle){
        if(this.allSpawnedVehicles.has(vehicle)){
            const mapData = this.allSpawnedVehicles.get(vehicle);
            if(mapData?.TimeoutId){
                alt.clearTimeout(mapData.TimeoutId);
            }
            this.destroyVehicleOnTimer(vehicle);
            console.log("Удален vehicle из MAP");
        }
    }

    destroyVehicleOnTimer(veh: alt.Vehicle){
        console.log('destroyVehicleOnTimer');
        this.allSpawnedVehicles.delete(veh);
        console.log("Удален vehicle из MAP");
        veh.destroy();
    }

    checkAllSpawnedVehicles(vehId: number){
        for (const [key, value] of this.allSpawnedVehicles) {
            if(value.vehicleId === vehId){
                console.log("Машина уже заспанена");
                return key;
            }
        }
        return false;
    }

    getSpawnedVehicleOwnerId(veh: alt.Vehicle){
        return this.allSpawnedVehicles.get(veh)?.vehOwnerId;
    }

    getSpawnedVehicleId(veh: alt.Vehicle){
        return this.allSpawnedVehicles.get(veh)?.vehicleId;
    }

    //ПОТОМ УДАЛИТЬ
    printAllSpawnedVehicles(){
        alt.log('Весь allSpawnedVehicles');
        this.allSpawnedVehicles.forEach((value, key) => {
            alt.log(`Ключ: ${(key)}`);
            alt.log('value:', (value));
        });
    }
}