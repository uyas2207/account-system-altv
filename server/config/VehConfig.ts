import * as alt from 'alt-server';
import {vehiclesForSaleList} from '@shared/SharedConfig'

type TConfig = {
    position: alt.Vector3;
    rotation: alt.Vector3;
}

export const vehicleSpawnCoords: Array<TConfig> = [
    {
        position: new alt.Vector3({x: -1653.32, y: -3182.40, z: 13.98}),
        rotation: new alt.Vector3({x: 0.0, y: 0.0, z: -0.54}),
    },
    {
        position: new alt.Vector3({x: -1641.80, y: -3173.96, z: 13.9}),
        rotation: new alt.Vector3({x: 0.0, y: 0.0, z: 0.99}),
    },
    {
        position: new alt.Vector3({x: -1659.27, y: -3178.36, z: 13.98}),
        rotation: new alt.Vector3({x: 0.0, y: 0.0, z: -0.45}),
    },
    {
        position: new alt.Vector3({x: -1666.10, y: -3174.30, z: 13.98}),
        rotation: new alt.Vector3({x: 0.0, y: 0.0, z: -0.45}),
    },
    {
        position: new alt.Vector3({x: -1675.67, y: -3166.40, z: 13.98}),
        rotation: new alt.Vector3({x: 0.0, y: 0.0, z: -0.45}),
    },
];

export const defaultParameters = {
    numberOfCarsForSale: vehiclesForSaleList.length, //не может быть больше чем vehicleSpawnCoords, если будет больше будет использоваться кол-во такое же как кол-во vehicleSpawnCoords
    percentageForSell: 0.75,              //75% от цены, на сколько надо умножить цену авто из конфига при продаже через команду /sell
    defaultAccountMoney: 10000,              //начальная сумма денег на аккаунте
    defaultDespawnTimer: 12000              //через сколько ms без водителя машина удалится
};