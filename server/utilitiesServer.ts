import * as alt from 'alt-server';

export function checkIsModelValid(model: string): boolean{
    const vehHash = alt.hash(`${model}`);
    const isModelValid = alt.getVehicleModelInfoByHash(vehHash);
    return isModelValid.title !== "";
}