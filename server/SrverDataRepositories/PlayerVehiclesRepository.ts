import alt from 'alt-server';

import { ISpawnedVehicleData } from '../Config/Types/ISpawnedVehicleData';

export class PlayerVehiclesRepository {
    private readonly _allSpawnedVehicles: Map <alt.Vehicle, ISpawnedVehicleData> = new Map <alt.Vehicle, ISpawnedVehicleData>();

    hasVeh(veh: alt.Vehicle): boolean {
        return this._allSpawnedVehicles.has(veh);
    }

    getVeh(veh: alt.Vehicle): ISpawnedVehicleData | undefined {
        return this._allSpawnedVehicles.get(veh);
    }

    getVehDespawnTimeoutId(veh: alt.Vehicle): number | undefined | null {
        return this._allSpawnedVehicles.get(veh)?.DespawnTimeoutId;
    }

    setVeh(veh: alt.Vehicle, spawnedVehicleData: ISpawnedVehicleData): void {
        this._allSpawnedVehicles.set(veh, spawnedVehicleData);
    }
 
    deleteVeh(veh: alt.Vehicle): void {
        this._allSpawnedVehicles.delete(veh);
    }

    clearVehDespawnTimeoutId(veh: alt.Vehicle): void {
        const vehData = this.getVeh(veh);
        if(vehData){
           vehData.DespawnTimeoutId = null;
        }
    }

    addVehDespawnTimeoutId(veh: alt.Vehicle, despawnTimeoutId: number): void {
        const vehData = this.getVeh(veh);
        if(vehData){
            vehData.DespawnTimeoutId = despawnTimeoutId;
        }
    }

    checkallSpawnedVehiclesByVehId(vehId: number): alt.Vehicle | undefined {
        for (const [key, value] of this._allSpawnedVehicles) {
            if(value.vehicleId === vehId){
                return key;
            }
        }
    }
}