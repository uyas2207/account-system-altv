import * as alt from 'alt-client';
import { drawNotification } from './utilities';
let label: any;



class CarShopClient {
    
    constructor(){
        this.#init();
    }
    
    #init(){
        alt.on('consoleCommand', async (command, ...arg) => {

        /*     if(command === 'vehinfo'){
                const entity = alt.Player.local.vehicle as Record<string, any>;
                for (let key in entity) {                
                    try {
                        alt.log(`${key} = ${entity[key]}`);
                    } catch (error) {
                        
                    }
                }
            } */
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
                //(text: string, fontName: string, fontSize: number, scale: number, pos: alt.IVector3, rot: alt.IVector3, color: alt.RGBA, outlineWidth: number, outlineColor: alt.RGBA, useStreaming?: boolean, streamingDistance?: number)
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
            if(vehicle.hasStreamSyncedMeta('CarForSalePrice')){
                const price = vehicle.getStreamSyncedMeta('CarForSalePrice') as number;
                drawNotification(`/buy что бы купить машину ${vehicle.model}, Цена: ${price}`);      //вынести тест в конфиг
            }
        }); 
    }

    #allowCarPurchase(price: number, vehicle: alt.Vehicle){
        

    }
}