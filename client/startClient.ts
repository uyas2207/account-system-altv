import * as alt from 'alt-client';
import native from 'natives'

import { drawNotification } from './utilities';
let label: any;

import { IVehiclesConfig } from '@shared/types/IVehiclesConfig'
import { CarShopVisuals } from './CarShopVisuals'


class CarShopClient {
    private readonly carShopVisuals: CarShopVisuals;
    constructor(){
        this.#init();
        this.carShopVisuals = new CarShopVisuals();
    }
    
    #init(){
        alt.on('consoleCommand', async (command, ...arg) => {

            if(command === 'del'){
                this.carShopVisuals.testDell(Number(arg[0]));
            }

            if(command === 'vehinfo'){
                const entity = alt.Player.local.vehicle as Record<string, any>;
                for (let key in entity) {                
                    try {
                        alt.log(`${key} = ${entity[key]}`);
                    } catch (error) {
                        
                    }
                }
            } 
        //marker 500 1 2
            if(command === 'marker'){
                const fontSize = arg[0] ? Number(arg[0]) : 10;
                const scale = arg[1] ? Number(arg[1]) : 2;
                const outlineWidth = arg[2] ? Number(arg[2]) : 1;

                if (label && label.valid) {
                    label.destroy();
                }

                label = new alt.TextLabel(
                    'Text\nText2', 
                    `ChaletLondon`,
                    fontSize,      
                    scale,         
                    new alt.Vector3(-1648.79, -3139.85, 13.98), 
                    new alt.Vector3(0,0,0), 
                    new alt.RGBA(255, 0, 0, 255), 
                    outlineWidth,
                    new alt.RGBA(0, 0, 255, 255), 
                    true, 
                    10
                );
                //(text: string, fontName: string, fontSize: number, scale: number, pos: alt.IVector3, rot: alt.IVector3, tColor: alt.RGBA, outlineWidth: number, outlinetColor: alt.RGBA, useStreaming?: boolean, streamingDistance?: number)
            }

            if(command === 'destroy'){
                label.destroy();
                label = null;
            }
            if(command === 'font'){
                console.log('label.font', label.font);
            }
        });

        alt.on('startEnteringVehicle', (vehicle, seat, player) => {
            console.log("vehicle.id", vehicle.id)
            const model = native.getDisplayNameFromVehicleModel(vehicle.model);
            console.log('model', model);
            if(vehicle.hasStreamSyncedMeta('CarForSaleId')){
                drawNotification(`/buy что бы купить машину ${vehicle.model}`);      //вынести текст в конфиг
            }
        });

        alt.on('streamSyncedMetaChange', (entity, metaKey, value, oldValue) => {
            if(metaKey === 'CarForSaleId' && value === undefined){
                this.carShopVisuals.testDell(oldValue);
            }
        });

        alt.onServer('carShop:createClientDemonstrationScene', (vehiclesForSale) => {
            this.carShopVisuals.createTextLabels(vehiclesForSale);
            //this.#createDemonstrationScene(vehiclesForSale);

        });
    }

    #createDemonstrationScene(config: IVehiclesConfig){
/*         for (let index = 0; index < config.vehiclesForSale.length; index++) {
            const e = config.vehiclesForSale[index];
            const text = e.textCoords;
            const tColor = e.textColor;
            new alt.TextLabel(
                `${e.model}\n${e.price}`,
                `ChaletLondon`,
                100,
                1,
                new alt.Vector3(
                    e.x + text.offsetX,
                    e.y + text.offsetY, 
                    e.z + text.offsetZ
                ),
                new alt.Vector3( e.rx, e.ry, e.rz),
                new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                2,
                new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                true,
                text.distance
            );
        } */
        config.vehiclesForSale.forEach((e, index) => {
            const text = e.textCoords;
            const tColor = e.textColor;
            new alt.TextLabel(
                `${e.model}\n${e.price}`,
                `ChaletLondon`,
                100,
                1,
                new alt.Vector3(
                    e.x + text.offsetX,
                    e.y + text.offsetY, 
                    e.z + text.offsetZ
                ),
                new alt.Vector3( e.rx, e.ry, e.rz),
                new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                2,
                new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                true,
                text.distance
            );
        });
    }

    #allowCarPurchase(price: number, vehicle: alt.Vehicle){
        

    }
}

new CarShopClient();