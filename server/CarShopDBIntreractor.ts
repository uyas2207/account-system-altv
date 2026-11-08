import alt from 'alt-server';

import { Kysely, Transaction, UpdateResult } from 'kysely';

import { Database } from './Database/database';
import { AccountDBRepository } from "./DataBaseRepositories/AccountDBRepository";
import { VehicleDBRepository } from "./DataBaseRepositories/VehicleDBRepository";

import { defaultParameters } from './Config/ServerConfig'

import { IVehData } from "./Config/Types/IVehData";

import { ClientError } from './Errors/ClientError'

export class CarShopDBIntreractor{
    protected readonly _db: Kysely<Database>
    public readonly account: AccountDBRepository;
    public readonly veh : VehicleDBRepository;

    constructor(
        db: Kysely<Database>,
        accountDBRepository: AccountDBRepository, 
        vehicleDBRepository: VehicleDBRepository,
    ){
        this._db = db;
        this.account = accountDBRepository;
        this.veh = vehicleDBRepository;
    }

    async sellVehicleTransaction(data:IVehData, vehId: number): Promise<number | undefined>{
       const moneyAfterTransaction = await this._transaction(async (trx) => {
            const deleteResult = await this.veh.deleteRowByPrimaryKey(vehId, trx);
            if(deleteResult.numDeletedRows === 0n){
                throw new ClientError("Операция с этой машиной недоступна в данный момент"); //машина уже продана
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
            const result = await this.veh.insertNewRow({
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

    private async _transaction<T>(
        callback: (trx: Transaction<Database>) => Promise<T>
    ): Promise<T> {
        return await this._db.transaction().execute(async (trx) => {
            return await callback(trx);
        });
    }
}