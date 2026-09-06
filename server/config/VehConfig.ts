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
    invincible: true,
    collision: false  
};


/* sp	-1648.79, -3139.85, 13.98

Position: -1641.80, -3173.96, 13.98	r 0.99


Position: -1653.32, -3182.40, 13.98	r -0.54
"x": -1653.32, "y": 3182.40, "z": 13.98, "rx": 0.0, "ry": 0.0, "rz": -0.54,

Position: -1659.27, -3178.36, 13.98	r -0.45 +- -0.54

Position: -1666.10, -3174.30, 13.98	r -0.45 +- -0.54

Position: -1675.67, -3166.40, 13.98	r -0.45 +- -0.54

 Position: -1682.44, -3162.03, 13.98	r -0.45 +- -0.54

 */