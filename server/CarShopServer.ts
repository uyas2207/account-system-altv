import alt from 'alt-server';
const chat = require('alt:chat'); // вместо import * as chat from 'alt:chat'; что бы для ts не нужно было добавлять декларацию

import { IVehiclesConfig } from './types/IVehiclesConfig'
/* import { DatabaseService } from './DatabaseService' */

export class CarShopServer{
    private readonly activeVehiclesForSale: Array<alt.Vehicle>;

    constructor(private readonly config: IVehiclesConfig, /* private readonly databaseService: DatabaseService */){
        this.activeVehiclesForSale = [];

        this.#registerEventListeners();
    }

    #registerEventListeners(){
/*         alt.on('playerEnteringVehicle', (player, vehicle, seat) => {
            if (this.activeVehiclesForSale.includes(vehicle)){
                alt.emitClient(player, "carShop:allowCarPurchase", vehicle);
            }
        }); */

        alt.onClient('carShop:onVehiclePurchase', (player, vehicle) => {
            if (this.activeVehiclesForSale.includes(vehicle)){
                //this.vehicleDataValidation();
            }
        });
    }
    //vehicleDataValidation(ownerId: number, model: string, mainColour:string, secondaryColour:string, registrationNumber: string){}
    async createDemonstrationScene(){
        this.config.vehiclesForSale.forEach(e => {
            //console.log('e', e);
            const veh = new alt.Vehicle(e.model, e.x, e.y, e.z, e.rx, e.ry, e.rz);
            
            const primary = e.colorData.customPrimaryColor;
            const secondary = e.colorData.customSecondaryColor;
            veh.customPrimaryColor = new alt.RGBA(primary.r, primary.g, primary.b, primary.a);
            veh.customSecondaryColor = new alt.RGBA(secondary.r, secondary.g, secondary.b, secondary.a);
            veh.setStreamSyncedMeta('CarForSalePrice', e.price);
            this.activeVehiclesForSale.push(veh);
        });
        //console.log('activeVehiclesForSale', this.activeVehiclesForSale);
    }

    onCarPurchaseAttempt(player: alt.Player){
        if(player.vehicle === null){
            chat.send(player, 'Для покупки автомобиля нужно сидеть в автомобиле');
            return;
        }
        if(!this.activeVehiclesForSale.includes(player.vehicle)){
            chat.send(player, 'Этот автомобиль не продается');
            return;
        }
/*         if(!this.databaseService.accountLoginValidation(player)){
            chat.send(player, 'Нельзя покупать автомобиль не войдя в аккаунт');
            return;
        } */
        if(player.vehicle.hasStreamSyncedMeta('CarForSalePrice')){
            const price = player.vehicle.getSyncedMeta('CarForSalePrice') as number;
            /* this.databaseService.carPurchaseAttempt(player, player.vehicle, price); */
        }
        else{
            chat.send(player, 'Произошла ошибка, нет цены у авто');
            return;
        }
    }

    sendPlayerCarsForSale(player: alt.Player){

    }
}