import alt from 'alt-server';

import { VehicleDBService } from './DataBase_classes/VehicletDBService'
import { AccountManager } from './AccountManager'

import { defaultParameters, vehicleSpawnCoords } from './config/VehConfig'
import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig'
import { Vehicles } from './database/database'

import { checkIsModelValid } from './utilitiesServer'

export class CarShopServer{
    constructor(
        private readonly config: Array<IVehiclesForSaleList>,
        private readonly vehicleDBService: VehicleDBService,
        private readonly accoutManager: AccountManager
    ){
    }

    createVehiclesForSale(): void {
        for (let index = 0; index < Math.min(defaultParameters.numberOfCarsForSale, vehicleSpawnCoords.length); index++) { 
            
            const model = this.config[index]?.model;
           
            if(checkIsModelValid(model ?? "")){
                const position = vehicleSpawnCoords[index]?.position;
                const rotation = vehicleSpawnCoords[index]?.rotation;

                if(!position || !rotation){
                    throw new Error("Неправильные данные в конфиге");
                }

                const veh = new alt.Vehicle(model!, position, rotation);
                veh.primaryColor = this.config[index]?.primaryColor ?? 0;
                veh.secondaryColor = this.config[index]?.secondaryColor ?? 0;
                veh.numberPlateText = "_";
                veh.setStreamSyncedMeta('CarForSaleId', index); //inex в syncMeta это место с данными по машине в массиве шаред конфига
            }
            else{
                alt.logError("Передано неправильное значение model из фонфига по индексу =", index);
            }
        }
    }

    checkIsCarForSale(player: alt.Player): void {
        const vehicle = player.vehicle;
        if(!vehicle){
            throw new Error('Для покупки автомобиля нужно сидеть в автомобиле');
        }
        if(!vehicle!.hasStreamSyncedMeta('CarForSaleId')){
            throw new Error('Этот автомобиль не продается');
        }
        //return vehicle;
    }

    async changeVehColor(vehId: number, color1: number, color2: number): Promise<void> {
        const row = await this.vehicleDBService.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        row.primaryColor = color1;
        row.secondaryColor = color2;
        await this.vehicleDBService.updateColorsByPrimaryKey(vehId, row);
    }

    async requestVehsByPlayer(player: alt.Player): Promise<Vehicles[]> {
        const currentPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
        const allvehs = await this.vehicleDBService.getAllVehsByAccountId(currentPlayerAccountId);
        return allvehs;
    }

    findVehPriceInConfig(model: string): number | undefined {
        const foundCar = this.config.find(value => value.model.toLowerCase() === model.toLowerCase()); //регистр в конфиге может отличаться от регистра getVehicleModelInfoByHash
/*         if(!foundCar ||foundCar.price){
            alt.logError("Попытка купить машину которой нет в конфиге model:", model);
            throw new Error("Не удалось купить машину");  
        } */
        return foundCar?.price;
    }
}