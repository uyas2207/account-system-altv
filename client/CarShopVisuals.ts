import * as alt from 'alt-client';

import { IVehiclesConfig } from '@shared/types/IVehiclesConfig'

export class CarShopVisuals {
    //возможно можно использовать что то более простое чем map, но по поиску элементов и их удалению не меняя id по которым будет обращения map подходит больше всего (если в массиве удалить элемент по index остальные индексы съедут а держать пустой элемент в нем что бы индексы не съезжали неправильно)
    private priceTextLabels: Map <number, alt.TextLabel> = new Map <number, alt.TextLabel>();

    constructor(){
    }

    createTextLabels(config: IVehiclesConfig){
        config.vehiclesForSale.forEach((e, index) => {
            const text = e.textCoords;
            const tColor = e.textColor;
            const label = new alt.TextLabel(
                `${e.model}\n${e.price}`,
                "ChaletLondon",
                100,
                1,
                new alt.Vector3(
                    e.x + text.offsetX,
                    e.y + text.offsetY, 
                    e.z + text.offsetZ
                ),
                new alt.Vector3( e.rx, e.ry, e.rz),
                new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                2,
                new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                true,
                text.distance
            );
            console.log('label.font', label.font);
            this.priceTextLabels.set(index, label);
        });
    }

    testDell(index: number){
        if(this.priceTextLabels.has(index) !== null && this.priceTextLabels.get(index) !== undefined){
        const label = this.priceTextLabels.get(index)
        // !. так как проверка на undefined уже была 
        label!.destroy();
        this.priceTextLabels.delete(index);
        }
        else{
            alt.logError(`Под значением ${index} нет label`);
        }
    }

    //дебаг команда потом удалить
    print(){
        alt.log('Весь priceTextLabels');
        this.priceTextLabels.forEach((value, key) => {
            alt.log(`Ключ: ${(key)}`);
            alt.log('value:', (value));
        });
    }
}