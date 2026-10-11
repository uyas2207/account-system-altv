import alt from 'alt-server';

import { VehiclesDataCollector } from './VehiclesDataCollector'
import { SpawnedVehsManager } from './SpawnedVehsManager';
import { VehicleDBRepository } from './dataBaseRepositories/VehicleDBRepository';

export class PlayerVehicleService {
    constructor(
        private readonly vehiclesDataCollector: VehiclesDataCollector,
        private readonly spawnedVehsManager: SpawnedVehsManager,
        private readonly vehicleDBRepository: VehicleDBRepository
    ){
    }
    //Методы вызываемые из CommandManager для взаимодействия с автомобилями которые принадлежат игроку
    async onChangeColorAttempt(player: alt.Player, color1: number, color2: number){
        const collectedData = this.vehiclesDataCollector.checkVehicleOwnershipAndCollectData(player);
        await this._changeDBVehColor(collectedData.vehId, color1, color2);
        this._changeVehColor(collectedData.veh, color1, color2);
    }

    async onChangeNumberPlateAttempt(player: alt.Player, text: string){
        const collectedData = this.vehiclesDataCollector.checkVehicleOwnershipAndCollectData(player);
        await this._changeDBNuberPlate(collectedData.vehId, text);
        this._changeVehNumberPlate(collectedData.veh, text);
    }

    async onSpawnVehicleAttempt(player: alt.Player, vehId: number) {
        const vehData = await this.vehiclesDataCollector.requestVehsByVehId(player, vehId);
        //возвращает данные о том заспавнена машина или телепортирована к игроку (для отображения в чате)
        return this.spawnedVehsManager.getOrSpawnVehicle(player, vehData);
    }

    async requestVehsByPlayer(player: alt.Player){
        return await this.vehiclesDataCollector.requestVehsByPlayer(player);
    }
    
    //Методы для изменения параметров авто в базе данных
    private async _changeDBNuberPlate(vehId: number, text: string): Promise<void> {
        const row = await this.vehicleDBRepository.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        await this.vehicleDBRepository.updateRegistrationNumberByPrimaryKey(vehId, text);
    }

    private async _changeDBVehColor(vehId: number, color1: number, color2: number){
        const row = await this.vehicleDBRepository.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        return await this.vehicleDBRepository.updateColorsByPrimaryKey(vehId, color1, color2);
    }
    //Методы для изменения физических параметров авто (можно создать другой класс, типо PlayerVehicleAppearance)
    private async _changeVehColor(veh: alt.Vehicle, color1: number, color2: number){
        veh.primaryColor = color1;
        veh.secondaryColor = color2;
    }

    private async _changeVehNumberPlate(veh: alt.Vehicle, text: string){
        veh.numberPlateText = text;
    }
}