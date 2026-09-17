import alt from 'alt-server';

import { VehicleDBService } from './DataBase_classes/VehicletDBService'
import { AccountManager } from './AccountManager'

import { defaultParameters, vehicleSpawnCoords } from './config/VehConfig'
import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig'
import { Vehicles } from './database/database'

import { DBTransactionManager } from './DataBase_classes/DBTransactionManager';
import { SpawnedVehsManager } from './SpawnedVehsManager'

import { checkIsModelValid } from './utilitiesServer'

interface IVehData {
    accountId: number;
    model: string;
    price: number;
}

export class CarShopServer{
    constructor(
        private readonly config: Array<IVehiclesForSaleList>,
        private readonly vehicleDBService: VehicleDBService,
        private readonly accoutManager: AccountManager,
        private readonly DBTransactionManager: DBTransactionManager,
        private readonly vehiclesManager: SpawnedVehsManager,
    ){
    }

    createVehiclesForSale(): void {
        for (let index = 0; index < Math.min(defaultParameters.numberOfCarsForSale, vehicleSpawnCoords.length); index++) { 
            
            const model = this.config[index]?.model;
           
            if(checkIsModelValid(model ?? "")){
                const position = vehicleSpawnCoords[index]?.position;
                const rotation = vehicleSpawnCoords[index]?.rotation;

                if(!position || !rotation){
                    throw new Error("Неправильные данные в конфиге");
                }

                const veh = new alt.Vehicle(model!, position, rotation);
                veh.primaryColor = this.config[index]?.primaryColor ?? 0;
                veh.secondaryColor = this.config[index]?.secondaryColor ?? 0;
                veh.numberPlateText = "_";
                veh.setStreamSyncedMeta('CarForSaleId', index); //inex в syncMeta это место с данными по машине в массиве шаред конфига
            }
            else{
                alt.logError("Передано неправильное значение model из фонфига по индексу =", index);
            }
        }
    }

    async purchaseVehicle(player: alt.Player, veh: alt.Vehicle){
        this.checkIsCarForSale(player);
        const data = this._getPlayerVehData(player, veh);
    
        const vehDBId = await this.DBTransactionManager.transaction(async (trx) => {
            const playerMoney = await this.DBTransactionManager.account.getMoneyByPrimaryKey(data.accountId, trx);
            if (typeof playerMoney !== "number") {
                throw new Error(`Игрок с ID ${data.accountId} не найден в базе данных`);
            }
            if(playerMoney < data.price){
                throw new Error("На аккаунте недостаточно денег");
            }

            const moneyAfterOperation = playerMoney - data.price;
            await this.DBTransactionManager.account.updateMoneyByPrimaryKey(data.accountId, moneyAfterOperation, trx);
            const result = await this.DBTransactionManager.vehicle.insertNewRow({
                ownerId: data.accountId,
                model: data.model,
                primaryColor: veh.primaryColor,
                secondaryColor: veh.secondaryColor,
                price: data.price
            }, trx);

            return result;
        });
        return vehDBId[0]?.insertId;
        //veh.deleteStreamSyncedMeta('CarForSaleId');
    }

    async sellVehicle(player: alt.Player, veh: alt.Vehicle): Promise<void>{
        const data = this._getPlayerVehData(player, veh);
        const vehOwnerId = this.chechkVehicleOwner(player, veh);
        const vehId = this.vehiclesManager.getSpawnedVehicleId(veh);

        if(!vehOwnerId || !vehId){
            alt.logError(`Не хватает данных, vehOwnerId: ${vehOwnerId}, vehId: ${vehId}`);
            throw new Error("Произошла непредвиденная ошибка");
        }

        await this.DBTransactionManager.transaction(async (trx) => {
            const currentPlayerMoney = await this.DBTransactionManager.account.getMoneyByPrimaryKey(data.accountId, trx);
            if(typeof currentPlayerMoney !== "number"){
                throw new Error("Не удалось получить кол-во денег на аккаунте");
            }
            const resultMoney = Math.trunc(currentPlayerMoney + (data.price * defaultParameters.percentageForSell));
            await this.DBTransactionManager.vehicle.deleteRowByPrimaryKey(vehId, trx);
            await this.DBTransactionManager.account.updateMoneyByPrimaryKey(data.accountId, resultMoney, trx);
        });
        this.vehiclesManager.checkVehicleBeforeDestroy(veh);
    }

    private _getPlayerVehData(player: alt.Player, veh: alt.Vehicle): IVehData {
        const accountId = this.accoutManager.requestPlayerAccountId(player);
        const model = (alt.getVehicleModelInfoByHash(veh.model).title);
        const price = this.findVehPriceInConfig(model);

        //пытался вынести проверку в findVehPriceInConfig, но ts выдавал ошибку поэтому проверка тут
        if(!price){
            alt.logError("Попытка купить машину которой нет в конфиге model:", model);
            throw new Error("Нет корректной цены у машины");  
        }
        return({ accountId, model, price});
    }
    
    chechkVehicleOwner(player: alt.Player, veh: alt.Vehicle): number{
        const accountId = this.accoutManager.requestPlayerAccountId(player);
        const vehOwnerId = this.vehiclesManager.getSpawnedVehicleOwnerId(veh);
        if(accountId !== vehOwnerId){
            throw new Error ("Вы не являетесь владельцем авто");
        }
        return accountId;//нет смысла возврщать и accountId и vehOwnerId так как они прошли проверку => одинаковые
    }

    checkIsCarForSale(player: alt.Player): void {
        const vehicle = player.vehicle;
        if(!vehicle){
            throw new Error('Для покупки автомобиля нужно сидеть в автомобиле');
        }
        if(!vehicle!.hasStreamSyncedMeta('CarForSaleId')){
            throw new Error('Этот автомобиль не продается');
        }
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
    
    async requestVehsByPlayer(player: alt.Player): Promise<Vehicles[]> {
        const currentPlayerAccountId = this.accoutManager.requestPlayerAccountId(player);
        const allvehs = await this.vehicleDBService.getAllVehsByAccountId(currentPlayerAccountId);
        return allvehs;
    }

    findVehPriceInConfig(model: string): number | undefined {
        const foundCar = this.config.find(value => value.model.toLowerCase() === model.toLowerCase()); //регистр в конфиге может отличаться от регистра getVehicleModelInfoByHash
/*         if(!foundCar || !foundCar.price){
            alt.logError("Попытка купить машину которой нет в конфиге model:", model);
            throw new Error("Не удалось купить машину");  
        } */
        return foundCar?.price;
    }
}