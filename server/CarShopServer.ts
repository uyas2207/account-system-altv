import alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

import { IVehiclesConfig } from '@shared/types/IVehiclesConfig'
import { VehicleDBService } from './DataBase classes/VehicletDBService'
import { AccountManager } from './AccountManager'

export class CarShopServer{
    //в теории можно убрать и полностью перейти на Meta и после проверки машины на наличие нужной меты проболжать покупку, но мне кажется с set тоже нормально (надесь это не плодит лишние сущности)
    private readonly activeVehiclesForSale: Set<alt.Vehicle>;

    constructor(
        private readonly config: IVehiclesConfig, 
        private readonly vehicleDBService: VehicleDBService,
        private readonly accoutManager: AccountManager
    ){
        this.activeVehiclesForSale = new Set();

        this.#registerEventListeners();
    }

    #registerEventListeners(){

        alt.onClient('carShop:onVehiclePurchase', (player, vehicle) => {
            if (this.activeVehiclesForSale.has(vehicle)){
            }
        });
    }
    //vehicleDataValidation(ownerId: number, model: string, mainColour:string, secondaryColour:string, registrationNumber: string){}
    async createDemonstrationScene(){
        this.config.vehiclesForSale.forEach((e, index) => {
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
        });
    }

    async onCarPurchaseAttempt(player: alt.Player){
        const vehicle = player.vehicle;
        if(vehicle === null){
            chat.send(player, 'Для покупки автомобиля нужно сидеть в автомобиле');
            return;
        }
        if(!this.activeVehiclesForSale.has(vehicle)){
            chat.send(player, 'Этот автомобиль не продается');
            return;
        }
        if(vehicle.hasStreamSyncedMeta('CarForSaleId')){
            try {
                const currentPlayerDBData = await this.accoutManager.requestPlayerForCarPurchase(player);
                const CarForSaleId = vehicle.getStreamSyncedMeta('CarForSaleId') as number;
                const vehConfigInfo = this.config.vehiclesForSale.at(CarForSaleId);
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
                        secondaryColour: vehicle.customSecondaryColor
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
        else{
            chat.send(player, 'Произошла ошибка, нет цены у авто');
            return;
        }
    }

    sendPlayerCarsForSale(player: alt.Player){

    }
}