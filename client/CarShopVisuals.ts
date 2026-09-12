import * as alt from 'alt-client';

import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig2'

export class CarShopVisuals {
    //возможно можно использовать что то более простое чем map, но по поиску элементов и их удалению не меняя id по которым будет обращения map подходит больше всего (если в массиве удалить элемент по index остальные индексы съедут а держать пустой элемент в нем что бы индексы не съезжали неправильно)
    private priceTextLabels: Map <number, alt.TextLabel> = new Map <number, alt.TextLabel>();

    constructor(){
    }

    createTextLabel(coords: alt.Vector3, e: IVehiclesForSaleList, rotation: alt.Vector3, index: number){
        const label = new alt.TextLabel(
            `${e.model}\n${e.price}`,
            "ChaletLondon",
            100,
            1,
            coords,
            rotation,
            new alt.RGBA(alt.RGBA.white),               //вынести в конфиг
            2,
            new alt.RGBA(alt.RGBA.white),
            true,
            100   
        );
        this.priceTextLabels.set(index, label);
        alt.logDebug('Создан labex:', index);
    }

    destroyLabel(index: number){
        if(this.priceTextLabels.has(index)){
            const label = this.priceTextLabels.get(index)
            label?.destroy();
            this.priceTextLabels.delete(index);
            alt.logDebug('Удален labex:', index);
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