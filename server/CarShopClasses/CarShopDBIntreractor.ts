import alt from 'alt-server';

import { Kysely, Transaction } from 'kysely';

import { Database } from '../database/database';
import { AccountDBService } from "../DataBase_classes/AccountDBService";
import { VehicleDBService } from "../DataBase_classes/VehicletDBService";

import { defaultParameters } from '../config/VehConfig'

import { Vehicles } from "../database/database";
import { IVehData } from "../config/types/IVehData";

export class CarShopDBIntreractor{
    protected readonly _db: Kysely<Database>
    public readonly account: AccountDBService;
    public readonly vehicle : VehicleDBService;

    constructor(
        db: Kysely<Database>,
        accountDBService: AccountDBService, 
        vehicleDBService: VehicleDBService,
    ){
        this._db = db;
        this.account = accountDBService;
        this.vehicle = vehicleDBService;
    }

    async sellVehicleTransaction(data:IVehData, vehId: number){
        const resultMoney = await this._transaction(async (trx) => {
            const currentPlayerMoney = await this.account.getMoneyByPrimaryKey(data.accountId, trx);
            if(typeof currentPlayerMoney !== "number"){
                throw new Error("Не удалось получить кол-во денег на аккаунте");
            }
            const resultMoney = Math.trunc(currentPlayerMoney + (data.price * defaultParameters.percentageForSell));
            await this.vehicle.deleteRowByPrimaryKey(vehId, trx);
            await this.account.updateMoneyByPrimaryKey(data.accountId, resultMoney, trx);
            return resultMoney;
        });
        return resultMoney;
    }

    async purchaseVehicleTransaction(data:IVehData, veh: alt.Vehicle){
        const vehDBId = await this._transaction(async (trx) => {
            const playerMoney = await this.account.getMoneyByPrimaryKey(data.accountId, trx);
            if (typeof playerMoney !== "number") {
                throw new Error(`Игрок с ID ${data.accountId} не найден в базе данных`);
            }
            if(playerMoney < data.price){
                throw new Error("На аккаунте недостаточно денег");
            }

            const moneyAfterOperation = playerMoney - data.price;
            await this.account.updateMoneyByPrimaryKey(data.accountId, moneyAfterOperation, trx);
            const result = await this.vehicle.insertNewRow({
                ownerId: data.accountId,
                model: data.model,
                primaryColor: veh.primaryColor,
                secondaryColor: veh.secondaryColor,
                price: data.price
            }, trx);

            return result;
        });

        return vehDBId[0]?.insertId;
    }

    async getVehicleRowByPrimaryKey(vehId: number){
        return await this.vehicle.getRowByPrimaryKey(vehId);
    }

    async updateVehicleRegistrationNumberByPrimaryKey(vehId: number, text: string){
        return await this.vehicle.updateRegistrationNumberByPrimaryKey(vehId, text);
    }

    async updateVehicleColorsByPrimaryKey(vehId: number, row: Vehicles){
        return await this.vehicle.updateColorsByPrimaryKey(vehId, row);
    }

    private async _transaction<T>(
        callback: (trx: Transaction<Database>) => Promise<T>
    ): Promise<T> {
        return await this._db.transaction().execute(async (trx) => {
            return await callback(trx);
        });
    }
}