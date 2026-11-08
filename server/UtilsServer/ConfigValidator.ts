import * as alt from 'alt-server';

import { vehiclesForSaleList } from '@shared/SharedConfig'
import { configValidationParameters } from '../Config/ServerConfig'


export class ConfigValidator{

    public static validateConfigs(){
        for (let index = 0; index < vehiclesForSaleList.length; index++) {
            const element = vehiclesForSaleList[index];
            this._validateVehModel(element?.model);
            this._validateVehPrice(element?.price);
            this._validateVehColor(element?.primaryColor);
            this._validateVehColor(element?.secondaryColor);
        }
        this._checkModelDuplications();
    }

    private static _validateVehModel(configModel: string | undefined){
        if(configModel === undefined){
            this._undefinedError("configModel");
            return;
        }
        const model = configModel;
        const vehHash = alt.hash(model);
        const validatedModel = alt.getVehicleModelInfoByHash(vehHash);
        if(validatedModel.title === ""){
            throw new Error(`Некорректная модель авто = ${configModel}`);
        }
    }

    private static _validateVehColor(configColor: number | undefined){
        if(configColor === undefined){
            this._undefinedError("configColor");
            return;
        }
        const num = configColor;
        if(!Number.isInteger(num) || num > configValidationParameters.maxColorNum || num < configValidationParameters.minColorNum){
            alt.logError(`[CarShop] Цветом может быть только целое число от ${configValidationParameters.minColorNum} до ${configValidationParameters.maxColorNum}`);
            throw new Error(`Некорректное значение цвета = ${configColor}`);
        }
    }

    private static _validateVehPrice(configPrice: number | undefined){
        if(configPrice === undefined){
            this._undefinedError("configPrice");
            return;
        }
        const price = configPrice;
        if(price < configValidationParameters.minPrice || price > configValidationParameters.maxPrice){
            alt.logError(`[CarShop] Цена авто должна быть больше ${configValidationParameters.minPrice} и меньше ${configValidationParameters.maxPrice}`);
            throw new Error(`Некорректное значение цены = ${configPrice}`);
        }
    }

    private static _checkModelDuplications(){
        const modelAndPriceList = new Map<string, number>();
        for (let index = 0; index < vehiclesForSaleList.length; index++) {
                const model = vehiclesForSaleList[index]!.model;   //уже выполнялась проверка на undefined в методах до checkModelDuplications
                const price = vehiclesForSaleList[index]!.price;   //уже выполнялась проверка на undefined в методах до checkModelDuplications
    
            if(!modelAndPriceList.has(model)){
                modelAndPriceList.set(model, price);
            }
            else{
                if(modelAndPriceList.get(model) !== price){
                    alt.logError("[CarShop] Обнаружено повторяющееся название модели с разной ценой, повторяющиеся модели могут быть только с одинаковой ценой");
                    throw new Error("Нельзя иметь в конфиге одинаковые модели с разной ценой(одинаковые машины на продаже но стоят по разному)");
                }
            }
            
        }
    }

    private static _undefinedError(parameterName: string){
        throw new Error(`Передано undefined значение для ${parameterName}`);
    }
}