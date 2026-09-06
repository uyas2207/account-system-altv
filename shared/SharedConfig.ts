import * as alt from 'alt-shared';
import { IVehiclesForSaleList } from '@shared/types/IVehiclesConfig2'

export const vehiclesForSaleList: Array<IVehiclesForSaleList> = [
    {
        model: "adder",
        customPrimaryColor: new alt.RGBA(alt.RGBA.red),
        customSecondaryColor: new alt.RGBA(alt.RGBA.red),
        price: 5000
    },
    {
        model: "benson",
        customPrimaryColor: new alt.RGBA(alt.RGBA.green),
        customSecondaryColor: new alt.RGBA(alt.RGBA.green),
        price: 10000
    }
]