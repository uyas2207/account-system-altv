import alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

import { VehicleDBService } from './DataBase classes/VehicletDBService'
import { AccountManager } from './AccountManager'

import { defaultParameters, vehicleSpawnCoords } from './config/VehConfig'
import { vehiclesForSaleList } from '@shared/SharedConfig'
import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig2'

export class CarShopServer{
    //в теории можно убрать и полностью перейти на Meta и после проверки машины на наличие нужной меты проболжать покупку, но мне кажется с set тоже нормально (надесь это не плодит лишние сущности)
    private readonly activeVehiclesForSale: Set<alt.Vehicle>;

    constructor(
        /* private readonly config: IVehiclesConfig,  */
        private readonly config2: Array<IVehiclesForSaleList>,
        private readonly vehicleDBService: VehicleDBService,
        private readonly accoutManager: AccountManager
    ){
        this.activeVehiclesForSale = new Set();

        this._registerEventListeners();
    }

    private _registerEventListeners(){

        alt.onClient('carShop:onVehiclePurchase', (player, vehicle) => {
            if (this.activeVehiclesForSale.has(vehicle)){
                //this.activeVehiclesForSale.
                alt.getVehicleModelInfoByHash
            }
        });
    }
    //vehicleDataValidation(ownerId: number, model: string, mainColour:string, secondaryColour:string, registrationNumber: string){}
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
            veh.customPrimaryColor = this.config2[index]?.customPrimaryColor ?? new alt.RGBA(0,0,0);
            veh.customSecondaryColor = this.config2[index]?.customSecondaryColor ?? new alt.RGBA(0,0,0);
            veh.setStreamSyncedMeta('CarForSaleId', index); //inex в syncMeta это место с данными по машине в массиве шаред конфига
        }


/*         this.config.vehiclesForSale.forEach((e, index) => {
            const veh = new alt.Vehicle(e.model, e.x, e.y, e.z, e.rx, e.ry, e.rz);
            const primary = e.colorData.customPrimaryColor;
            const secondary = e.colorData.customSecondaryColor;
            veh.customPrimaryColor = new alt.RGBA(primary.r, primary.g, primary.b, primary.a);
            veh.customSecondaryColor = new alt.RGBA(secondary.r, secondary.g, secondary.b, secondary.a);
            //StreamSyncedMeta('CarForSaleId', index) используется на клиенте при создании визуальных отображений машины и цены 
            //так как клиент проходится по такому же списку vehiclesForSale из такого же конфига при удалении StreamSyncedMeta с определенным индексом 
            //клиент сможет удалить надпись о продаже у того авто которое было продано (удалит label по index так как index 
            //это порядковый номер авто из конфига а конфиг одинаковый для клиента и сервера и перебирается в одном и том же порядке на сервере и клиенте)
            veh.setStreamSyncedMeta('CarForSaleId', index);
            this.activeVehiclesForSale.add(veh);
        }); */
    }

    async onCarPurchaseAttempt(player: alt.Player, ){
        const vehicle = this.checkIsCarForSale(player);
            try {
                const currentPlayerDBData = await this.accoutManager.requestPlayerDBData(player);
                const CarForSaleId = vehicle.getStreamSyncedMeta('CarForSaleId') as number;
                const vehConfigInfo = this.config2[CarForSaleId];
                //.! так как я уверен что в конфиге есть price (если в конфиге нет price то ts не даст компилировать)
                const price = vehConfigInfo!.price;
                if((currentPlayerDBData.money ?? 0) >= price){
                    //Вопрос кто должен заниматься подсчетами и нужно ли по ООП проводить запрос
                    //на изщменение суммы через AccoutManager или можно сразу оптравлять в AccountDBService
                    const playerMoneyAfterPurchase = currentPlayerDBData.money - price;
                    await this.accoutManager.changePlayerMoney(currentPlayerDBData.accountId, playerMoneyAfterPurchase);
                    this.vehicleDBService.insertNewRow({
                        ownerId: currentPlayerDBData.accountId,
                        model: vehicle.model,
                        mainColour: vehicle.customPrimaryColor,
                        secondaryColour: vehicle.customSecondaryColor,
                        price: price
                    });
                    chat.send(player, 'МАШИНА КУПЛЕНА УСПЕШНО');
                    vehicle.deleteStreamSyncedMeta('CarForSaleId');
                    this.activeVehiclesForSale.delete(vehicle);
                }
                else{
                    throw new Error('На аккаунте недостаточно денег');
                }

            } catch (error) {
                chat.send(player, `${error}`);
            }


            //this.vehicleDBService();

        
    }

    checkIsCarForSale(player: alt.Player){
        const vehicle = player.vehicle;
        if(vehicle === null){
            throw new Error('Для покупки автомобиля нужно сидеть в автомобиле');
/*             chat.send(player, 'Для покупки автомобиля нужно сидеть в автомобиле');
            return; */
        }
        if(!vehicle.hasStreamSyncedMeta('CarForSaleId')){
            throw new Error('Для покупки автомобиля нужно сидеть в автомобиле');
/*             chat.send(player, 'Этот автомобиль не продается');
            return; */
        }
        return vehicle;
    }

    onMyVehsCommand(player:  alt.Player){


    }

    sendPlayerCarsForSale(player: alt.Player){

    }
}