import alt from 'alt-server';

import {checkIsModelValid} from './UtilitiesServer'

import { defaultParameters, vehicleSpawnCoords } from './config/ServerConfig'
import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig'

export class VehiclesForSaleManager {
    constructor(
        private readonly config: Array<IVehiclesForSaleList>
    ){
    }

    createVehiclesForSale(): void {
        for (let index = 0; index < Math.min(defaultParameters.numberOfCarsForSale, vehicleSpawnCoords.length); index++) { 
            
            const model = this.config[index]?.model;
           
            if(checkIsModelValid(model ?? "")){
                const position = vehicleSpawnCoords[index]?.position;
                const rotation = vehicleSpawnCoords[index]?.rotation;

                if(!position || !rotation){
                    alt.logError(`Неправильные данные в конфиге position= ${position} rotation = ${rotation}`);
                    return;
                }

                const veh = new alt.Vehicle(model!, position, rotation);
                veh.primaryColor = this.config[index]?.primaryColor ?? 0;
                veh.secondaryColor = this.config[index]?.secondaryColor ?? 0;
                veh.numberPlateText = "_";
                this.addCarForSaleSyncedMeta(veh, index);
            }
            else{
                alt.logError(`Передано неправильное значение model из конфига по индексу = ${index} модель = ${model}`);
            }
        }
    }

    checkIsCarForSale(vehicle: alt.Vehicle): void {
        if(!vehicle.hasStreamSyncedMeta('CarForSaleId')){
            throw new Error('Этот автомобиль не продается');
        }
    }

    findVehPriceInConfig(model: string): number | undefined {
        const foundCar = this.config.find(value => value.model.toLowerCase() === model.toLowerCase()); //регистр в конфиге может отличаться от регистра getVehicleModelInfoByHash
        return foundCar?.price;
    }

    removeCarForSaleSyncedMeta(vehicle: alt.Vehicle): void{
        if(vehicle.hasStreamSyncedMeta('CarForSaleId')){
            vehicle.deleteStreamSyncedMeta('CarForSaleId');
        }
    }

    addCarForSaleSyncedMeta(veh: alt.Vehicle, index: number): void{
        veh.setStreamSyncedMeta('CarForSaleId', index); //inex в syncMeta это место с данными по машине в массиве шаред конфига
    }
}