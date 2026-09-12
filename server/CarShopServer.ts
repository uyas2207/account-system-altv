import alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

import { VehicleDBService } from './DataBase_classes/VehicletDBService'
import { AccountManager } from './AccountManager'

import { defaultParameters, vehicleSpawnCoords } from './config/VehConfig'
import { vehiclesForSaleList } from '@shared/SharedConfig'
import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig2'

export class CarShopServer{
    constructor(
        /* private readonly config: IVehiclesConfig,  */
        private readonly config2: Array<IVehiclesForSaleList>,
        private readonly vehicleDBService: VehicleDBService,
        private readonly accoutManager: AccountManager
    ){

        this._registerEventListeners();
    }

    private _registerEventListeners(){

        alt.onClient('carShop:onVehiclePurchase', (player, vehicle) => {
            alt.getVehicleModelInfoByHash;
        });
    }
    //vehicleDataValidation(ownerId: number, model: string, primaryColor:string, secondaryColor:string, registrationNumber: string){}
    async createVehiclesForSale(){

        for (let index = 0; index < Math.min(defaultParameters.numberOfCarsForSale, vehicleSpawnCoords.length); index++) {
            const model = this.config2[index]?.model;
            const coords = vehicleSpawnCoords[index];
            const position = vehicleSpawnCoords[index]?.position;
            const rotation = vehicleSpawnCoords[index]?.rotation;
//            const position = coords?.position  ?? new alt.Vector3(0,0,0);

            if(!model || !position || !rotation){
                throw new Error();
            }

            const veh = new alt.Vehicle(model, position, rotation);
            veh.primaryColor = this.config2[index]?.primaryColor ?? 0;
            veh.secondaryColor = this.config2[index]?.secondaryColor ?? 0;
            veh.numberPlateText = "_";
            veh.setStreamSyncedMeta('CarForSaleId', index); //inex в syncMeta это место с данными по машине в массиве шаред конфига
        }
    }

/*     async onCarPurchaseAttempt(player: alt.Player, ){
        try {
            const vehicle = this.checkIsCarForSale(player); // vehicle hash
            //const currentPlayerDBData = await this.accoutManager.requestPlayerDBData(player);
            const CarForSaleId = vehicle.getStreamSyncedMeta('CarForSaleId') as number;
            const vehConfigInfo = this.config2[CarForSaleId];
            //.! так как я уверен что в конфиге есть price (если в конфиге нет price то ts не даст компилировать)
            const price = vehConfigInfo!.price;
            if((currentPlayerDBData.money ?? 0) >= price){
                //Вопрос кто должен заниматься подсчетами и нужно ли по ООП проводить запрос
                //на изщменение суммы через AccoutManager или можно сразу оптравлять в AccountDBService
                const playerMoneyAfterPurchase = currentPlayerDBData.money - price;
                await this.accoutManager.changePlayerMoney(currentPlayerDBData.accountId, playerMoneyAfterPurchase);
                const model = alt.getVehicleModelInfoByHash(vehicle.model);
                const result = await this.vehicleDBService.insertNewRow({
                    ownerId: currentPlayerDBData.accountId,
                    model: model.title,
                    primaryColor: vehicle.primaryColor,
                    secondaryColor: vehicle.secondaryColor,
                    price: price
                });
                chat.send(player, 'МАШИНА КУПЛЕНА УСПЕШНО');
                vehicle.deleteStreamSyncedMeta('CarForSaleId');
                if (result){
                    const id = Number(result[0]!.insertId);
                    return id;
                }
            }
            else{
                throw new Error('На аккаунте недостаточно денег');
            }

            } catch (error) {
                chat.send(player, `${error}`);
            }


            //this.vehicleDBService();

        
    } */

    checkIsCarForSale(player: alt.Player){
        const vehicle = player.vehicle;
        if(!vehicle){
            throw new Error('Для покупки автомобиля нужно сидеть в автомобиле');
/*             chat.send(player, 'Для покупки автомобиля нужно сидеть в автомобиле');
            return; */
        }
        if(!vehicle.hasStreamSyncedMeta('CarForSaleId')){
            throw new Error('Этот автомобиль не продается');
/*             chat.send(player, 'Этот автомобиль не продается');
            return; */
        }
        return vehicle;
    }

    async changeVehColor(vehId: number, color1: number, color2: number){
        const row = await this.vehicleDBService.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        row.primaryColor = color1;
        row.secondaryColor = color2;
        return await this.vehicleDBService.updateColorsByPrimaryKey(vehId, row);
    }

    async requestVehsByPlayer(player: alt.Player){
        const currentPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
        const allvehs = await this.vehicleDBService.getAllVehsByAccountId(currentPlayerAccountId);
        return allvehs;
    }

    findVehPriceInConfig(model: string){
        const foundCar = this.config2.find(value => value.model.toLowerCase() === model.toLowerCase()); //регистр в конфиге может отличаться от регистра getVehicleModelInfoByHash
        return foundCar?.price;
    }
}