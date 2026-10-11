import * as alt from 'alt-server';

import { VehicleDBService } from './DataBase_classes/VehicletDBService';
import { VehiclesDataCollector } from "./CarShopClasses/VehiclesDataCollector";

export class PlayerVehicleAppearance {
    constructor(
        private readonly vehicleDBService: VehicleDBService,
        private readonly vehiclesDataCollector: VehiclesDataCollector
    ){
    }

    async onChangeColorAttempt(player: alt.Player, color1: number, color2: number){
        const collectedData = this.vehiclesDataCollector.checkVehicleAndCollectData(player);
        await this._changeDBVehColor(collectedData.vehId, color1, color2);
        this._changeVehColor(collectedData.veh, color1, color2);
    }

    async onChangeNumberPlateAttempt(player: alt.Player, text: string){
        const collectedData = this.vehiclesDataCollector.checkVehicleAndCollectData(player);
        await this._changeDBNuberPlate(collectedData.vehId, text);
        this._changeVehNumberPlate(collectedData.veh, text);
    }

    private async _changeDBNuberPlate(vehId: number, text: string): Promise<void> {
        const row = await this.vehicleDBService.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        await this.vehicleDBService.updateRegistrationNumberByPrimaryKey(vehId, text);
    }

    private async _changeDBVehColor(vehId: number, color1: number, color2: number){
        const row = await this.vehicleDBService.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        return await this.vehicleDBService.updateColorsByPrimaryKey(vehId, color1, color2);
    }

    private async _changeVehColor(veh: alt.Vehicle, color1: number, color2: number){
        veh.primaryColor = color1;
        veh.secondaryColor = color2;
    }

    private async _changeVehNumberPlate(veh: alt.Vehicle, text: string){
        veh.numberPlateText = text;
    }

}