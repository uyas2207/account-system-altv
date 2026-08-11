import alt from 'alt-server';

import { IVehiclesConfig } from './types/IVehiclesConfig'

export class CarShopServer{
    private readonly activeVehiclesForSale: Array<alt.Vehicle>;

    constructor(private readonly config: IVehiclesConfig){
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
            veh.setStreamSyncedMeta('CarForSale', 5000);
            this.activeVehiclesForSale.push(veh);
        });
        //console.log('activeVehiclesForSale', this.activeVehiclesForSale);
    }

    sendPlayerCarsForSale(player: alt.Player){
        
    }
}