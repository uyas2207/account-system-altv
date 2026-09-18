import * as alt from 'alt-client';

import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig'

import { visualTextLabelConfig } from "./ConfigClient/ConfigClient";

export class CarShopVisuals {
    //возможно можно использовать что то более простое чем map, но по поиску элементов и их удалению не меняя id по которым будет обращения map подходит больше всего (если в массиве удалить элемент по index остальные индексы съедут а держать пустой элемент в нем что бы индексы не съезжали неправильно)
    private priceTextLabels: Map <number, alt.TextLabel> = new Map <number, alt.TextLabel>();

    createTextLabel(coords: alt.Vector3, e: IVehiclesForSaleList, rotation: alt.Vector3, index: number){
        const label = new alt.TextLabel(
            `${e.model}\n${e.price}`,
            visualTextLabelConfig.fontName,
            visualTextLabelConfig.fontSize,
            visualTextLabelConfig.scale,
            coords,
            rotation,
            visualTextLabelConfig.color,
            visualTextLabelConfig.outlineWidth,
            visualTextLabelConfig.outlineColor,
            visualTextLabelConfig.useStreaming,
            visualTextLabelConfig.streamingDistance
        );
        this.priceTextLabels.set(index, label);
    }

    destroyLabel(index: number){
        if(this.priceTextLabels.has(index)){
            const label = this.priceTextLabels.get(index)
            label?.destroy();
            this.priceTextLabels.delete(index);
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