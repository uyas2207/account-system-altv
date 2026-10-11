import alt from 'alt-server';

import { Kysely, Transaction, UpdateResult } from 'kysely';

import { Database } from '../database/database';
import { AccountDBService } from "../DataBase_classes/AccountDBService";
import { VehicleDBService } from "../DataBase_classes/VehicletDBService";

import { defaultParameters } from '../config/ServerConfig'

import { Vehicles } from "../database/database";
import { IVehData } from "../config/types/IVehData";

import { ClientError } from '../ClientError'

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

    async sellVehicleTransaction(data:IVehData, vehId: number): Promise<number | undefined>{
       const moneyAfterTransaction = await this._transaction(async (trx) => {
            const deleteResult = await this.vehicle.deleteRowByPrimaryKey(vehId, trx);
            if(deleteResult.numDeletedRows === 0n){
                throw new ClientError("Операция с этой машиной недоступна в данный момент");
            }
            const sellingPrice = Math.trunc(data.price * defaultParameters.percentageForSell);
            await this.account.giveMoneyByPrimaryKey(data.accountId, sellingPrice, trx);

            return await this.account.getMoneyByPrimaryKey(data.accountId, trx);
        });
        return moneyAfterTransaction;
        
    }

    async purchaseVehicleTransaction(data:IVehData, veh: alt.Vehicle): Promise<bigint | undefined> {
        const vehDBId = await this._transaction(async (trx) => {
            const takeMoneyResult = await this.account.takeMoneyByPrimaryKey(data.accountId, data.price, trx);
            if (takeMoneyResult.numUpdatedRows === 0n){
                throw new ClientError("Недостаточно денег на аккаунте");
            }
            const result = await this.vehicle.insertNewRow({
                ownerId: data.accountId,
                model: data.model,
                primaryColor: veh.primaryColor,
                secondaryColor: veh.secondaryColor,
                price: data.price
            }, trx);
            return result;
        });

        return vehDBId.insertId;
    }

    async getVehicleRowByPrimaryKey(vehId: number): Promise<Vehicles | undefined> {
        return await this.vehicle.getRowByPrimaryKey(vehId);
    }

    async updateVehicleRegistrationNumberByPrimaryKey(vehId: number, text: string): Promise<UpdateResult>{
        return await this.vehicle.updateRegistrationNumberByPrimaryKey(vehId, text);
    }

    async updateVehicleColorsByPrimaryKey(vehId: number, row: Vehicles): Promise<UpdateResult>{
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