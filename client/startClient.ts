import * as alt from 'alt-client';
import native from 'natives'

import { drawNotification } from './utilities';

import { vehiclesForSaleList } from '@shared/SharedConfig'

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
            if(command === 'print'){
                this.carShopVisuals.print();
            }
        });

        alt.on("gameEntityCreate", async (entity) => {
            //пока что костыль, почему то при тп в зону с авто их коордлинаты считаются 0, хотя все проверки на valid isspawned visible scriptID и т.д. говорят что авто заспанилось корректно
            //почему то все проверки говорят что авто норм, но координаты неправильны, поэтому добавил задержку перед спавном текста что бы он был на корректных координатах
            if(entity.pos.x === 0){
                await new Promise(resolve => alt.setTimeout(resolve, 1000));
            }

            if(entity.hasStreamSyncedMeta('CarForSaleId')){
                const index = entity.getStreamSyncedMeta('CarForSaleId') as number;
                const nativeResult = native.getModelDimensions(entity.model);
                native.freezeEntityPosition(entity.scriptID, true);
                native.setVehicleUndriveable(entity.scriptID, true);
                native.setEntityCanBeDamaged(entity.scriptID, false);
                //native.setVehicleCanBreak(entity.scriptID, false);
                
                //длинна от центра машины до ее передней точки по y (независимо от угла под каким стоит машина, вычисления идут по модели в дефолт расположении по осям)
                const y = nativeResult[2].y;

                const expectedX = entity.pos.x - Math.sin(entity.rot.z) * y;
                const expectedY = entity.pos.y + Math.cos(entity.rot.z) * y;
                const expectedZ = entity.pos.z;

                const coords = new alt.Vector3(expectedX, expectedY, expectedZ);
                const configData = vehiclesForSaleList[index];
                this.carShopVisuals.createTextLabel(coords, configData!, entity.rot, index);
            }
        });

        alt.on("gameEntityDestroy", async (entity) => {
            if(entity.hasStreamSyncedMeta('CarForSaleId')){
                const index = entity.getStreamSyncedMeta('CarForSaleId') as number;
                this.carShopVisuals.testDell(index);
            }
        });

        alt.on('startEnteringVehicle', (vehicle, seat, player) => {
            console.log("vehicle.id", vehicle.id)
            if(vehicle.hasStreamSyncedMeta('CarForSaleId')){
                const model = native.getDisplayNameFromVehicleModel(vehicle.model);
                drawNotification(`/buy что бы купить машину ${model?.toLowerCase()}`);      //вынести текст в конфиг
            }
        });

        alt.on('streamSyncedMetaChange', (entity, metaKey, value, oldValue) => {
            if (!(entity instanceof alt.Entity)) return;

            if(metaKey === 'CarForSaleId' && value === undefined){
                native.freezeEntityPosition(entity.scriptID, false);
                native.setVehicleUndriveable(entity.scriptID, false);
                native.setEntityCanBeDamaged(entity.scriptID, true);
                this.carShopVisuals.testDell(oldValue);
            }
        });

/*         alt.onServer('carShop:createClientDemonstrationScene', (vehiclesForSale) => {
            //this.carShopVisuals.createTextLabels(vehiclesForSale);
            //this.#createVehiclesForSale(vehiclesForSale);

        }); */
    }

    #allowCarPurchase(price: number, vehicle: alt.Vehicle){
        

    }
}

new CarShopClient();