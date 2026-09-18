import alt from 'alt-server';

import { VehicleDBService } from './DataBase_classes/VehicletDBService'

import { SpawnedVehsManager } from './SpawnedVehsManager'

import { VehiclesForSaleManager } from "./CarShopClasses/VehiclesForSaleManager";
import { VehiclesDataCollector } from "./CarShopClasses/VehiclesDataCollector";
import { CarShopDBIntreractor } from "./CarShopClasses/CarShopDBIntreractor";

export class CarShopServer{
    constructor(
        private readonly vehicleDBService: VehicleDBService,
        private readonly carShopDBIntreractor: CarShopDBIntreractor,
        private readonly vehiclesManager: SpawnedVehsManager,
        private readonly vehiclesForSaleManager: VehiclesForSaleManager,
        private readonly vehiclesDataCollector: VehiclesDataCollector
    ){
  }

    async onCarPurchaseAttempt(player: alt.Player){
        const veh = this.vehiclesDataCollector.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle

        this.vehiclesForSaleManager.checkIsCarForSale(veh);
        const data = this.vehiclesDataCollector.getPlayerVehData(player, veh);
        const vehDBId = await this.carShopDBIntreractor.purchaseVehicleTransaction(data, veh);
        return vehDBId;
        //this.vehiclesForSaleManager.removeCarForSaleSyncedMeta(veh);
    }

    async onCarSellAttempt(player: alt.Player){
        const veh = this.vehiclesDataCollector.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
        
        const data = this.vehiclesDataCollector.getPlayerVehData(player, veh);
        const vehOwnerId = this.vehiclesDataCollector.chechkVehicleOwner(player, veh);
        const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);

        if(!vehOwnerId || !vehId){
            alt.logError(`Не хватает данных, vehOwnerId: ${vehOwnerId}, vehId: ${vehId}`);
            throw new Error("Произошла непредвиденная ошибка");
        }
        const resultMoney = await this.carShopDBIntreractor.sellVehicleTransaction(data, vehId);
        this.vehiclesManager.checkVehicleBeforeDestroy(veh);
        return resultMoney;
    }
    //как будто бы метод должен относиться к SpawnedVehsManager, но не хотелось бы ради одного метода передавать туда лишние зависимости vehiclesDataCollector
    async onSpawnVehicleAttempt(player: alt.Player, arg: string) {
        const allCurrentPlayerVehs = await this.vehiclesDataCollector.requestVehsByPlayer(player);
        const allVehIds = allCurrentPlayerVehs.map(playerVeh => playerVeh.vehId);
        const id = Number(arg);
        if(!(allVehIds.includes(id))){
            throw new Error("У вас нет авто стаким id");
        }
        const vehData = allCurrentPlayerVehs.find(playerVeh => playerVeh.vehId === id);
        if(!vehData){
            throw new Error("Не удалось получить необходимые данные об авто");
        }
        return this.vehiclesManager.getOrSpawnVehicle(player, vehData);
    }
    //как будто бы метод должен относиться к SpawnedVehsManager, но не хотелось бы ради одного метода передавать туда лишние зависимости vehiclesDataCollector
    async onChangeColorAttempt(player: alt.Player, color1: number, color2: number){
        const veh = this.vehiclesDataCollector.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
        this.vehiclesDataCollector.chechkVehicleOwner(player, veh);   //если игрок не владелец авто будет Error, если владелец вернет вернет vehOwnerId
        const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
        if(!vehId){
            throw new Error("Произошла ошибка при получении данных машины");
        }
        await this.changeVehColor(vehId, veh, color1, color2);
    }
    //как будто бы метод должен относиться к SpawnedVehsManager, но не хотелось бы ради одного метода передавать туда лишние зависимости vehiclesDataCollector
    async onChangeNumberPlateAttempt(player: alt.Player, text: string){
        const veh = this.vehiclesDataCollector.checkIsPlayerInVehicle(player); //если игрок не в авто Error, если в авто вернет player.vehicle
        this.vehiclesDataCollector.chechkVehicleOwner(player, veh);   //если игрок не владелец авто будет Error, если владелец вернет вернет vehOwnerId
        const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);
        if(!vehId){
            throw new Error("Произошла ошибка при получении данных машины");
        }
        await this.ChangeVehNuberPlate(vehId, veh, text);
    }

    async changeVehColor(vehId: number, veh: alt.Vehicle, color1: number, color2: number): Promise<void> {
        const row = await this.vehicleDBService.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        row.primaryColor = color1;
        row.secondaryColor = color2;
        await this.vehicleDBService.updateColorsByPrimaryKey(vehId, row);
        //скорее всего лушче закинуть в другой класс
        veh.primaryColor = color1;
        veh.secondaryColor = color2;
    }

    async ChangeVehNuberPlate(vehId: number, veh: alt.Vehicle, text: string): Promise<void> {
        const row = await this.vehicleDBService.getRowByPrimaryKey(vehId);
        if(!row){
            throw new Error("Не удалось получить из бд авто с переданным vehId");
        }
        await this.vehicleDBService.updateRegistrationNumberByPrimaryKey(vehId, text);
        //скорее всего лушче закинуть в другой класс
        veh.numberPlateText = text;
    }
    //спорный момент, но не хотелось передавать лишнюю зависимость в CommandManager
    async requestVehsByPlayer(player: alt.Player){
        return await this.vehiclesDataCollector.requestVehsByPlayer(player);
    }
}