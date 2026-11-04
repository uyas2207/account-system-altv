import * as alt from 'alt-client';
import native from 'natives'

import { drawNotification } from './UtilsClient/UtilitiesClient';
import { wait } from "@shared/UtilsShared/UtilitiesShared";
import { CarShopVisuals } from './CarShopVisuals'
import { vehiclesForSaleList } from '@shared/SharedConfig'

class CarShopClient {
    private readonly carShopVisuals: CarShopVisuals;
    constructor(){
        this.carShopVisuals = new CarShopVisuals();
        this._init();
    }
    
    private _init(): void {
        alt.on("gameEntityCreate", async (entity) => {
            if(entity.type !== alt.BaseObjectType.Vehicle) return;
            
            if(entity.hasStreamSyncedMeta('CarForSaleId')){
                this._setupCarForSale(entity as alt.Vehicle);
            }
        });

        alt.on("gameEntityDestroy", async (entity) => {
            if(entity.hasStreamSyncedMeta('CarForSaleId')){
                const index = entity.getStreamSyncedMeta('CarForSaleId') as number;
                this.carShopVisuals.destroyLabel(index);
            }
        });

        alt.on('startEnteringVehicle', (veh, seat, player) => {
            if(veh.hasStreamSyncedMeta('CarForSaleId')){
                const model = native.getDisplayNameFromVehicleModel(veh.model);
                drawNotification(`/buy что бы купить машину ${model?.toLowerCase()}`);
            }
        });

        alt.on('streamSyncedMetaChange', (entity, metaKey, value, oldValue) => {
            if(entity.type !== alt.BaseObjectType.Vehicle) return;
            
            if(metaKey === 'CarForSaleId' && value === undefined){
                this._toogleVehicleAvailability(entity as alt.Vehicle, true);
                this.carShopVisuals.destroyLabel(oldValue);
            }
        });
    }

    private async _setupCarForSale(entity: alt.Vehicle): Promise<void>{
        //пока что костыль, почему то при тп в зону с авто их коордлинаты считаются 0, хотя все проверки на valid isspawned visible scriptID и т.д. говорят что авто заспанилось корректно
        //почему то все проверки говорят что авто норм, но координаты неправильны, поэтому добавил задержку перед спавном текста что бы он был на корректных координатах
        if(entity.pos.x === 0){
            await wait(800);
        }
        this._toogleVehicleAvailability(entity, false);
        
        const coords = this._calculateVehicleTextCoords(entity);
        const model = native.getDisplayNameFromVehicleModel(entity.model);
        const configData = this._findVehPriceInConfig(model ?? "");

        if(!configData){
            alt.logError(`Не удалось найти машину в конфиге`);
            return;
        }
        this.carShopVisuals.createTextLabel(coords, configData?.element, entity.rot, configData?.index);
    }

    private _toogleVehicleAvailability(entity: alt.Vehicle, vehicleAvailabilityState: boolean): void{
        native.freezeEntityPosition(entity.scriptID, !vehicleAvailabilityState);
        native.setVehicleUndriveable(entity.scriptID, !vehicleAvailabilityState);
        native.setEntityCanBeDamaged(entity.scriptID, vehicleAvailabilityState);
    }

    private _calculateVehicleTextCoords(entity: alt.Vehicle): alt.Vector3 {
        const nativeResult = native.getModelDimensions(entity.model);
        //длинна от центра машины до ее передней точки по y (независимо от угла под каким стоит машина, вычисления идут по модели в дефолт расположении по осям)
        const length = nativeResult[2].y;

        const expectedX = entity.pos.x - Math.sin(entity.rot.z) * length;
        const expectedY = entity.pos.y + Math.cos(entity.rot.z) * length;
        const expectedZ = entity.pos.z + 0.5;
        return new alt.Vector3(expectedX, expectedY, expectedZ);
    }
    //ищет в конфиге авто с таким же названием и берет его данные
    private _findVehPriceInConfig(model: string){
        if(model === ""){
            alt.logError("Переданно некорректное название модели авто");
            return;
        }
        for (let index = 0; index < vehiclesForSaleList.length; index++) {
            const element = vehiclesForSaleList[index];
            if(element?.model.toLowerCase() === model.toLowerCase()){
                return {element, index};
            }
        }
    }

}

new CarShopClient();