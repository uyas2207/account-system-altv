
export interface IVehicleSpawnCoords {
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
}

export interface IColorRGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface IColorData {
    customPrimaryColor: IColorRGBA;
    customSecondaryColor: IColorRGBA;
}

export interface ItextCoords {
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    distance: number;
}

export interface IVehicleSaleData extends IVehicleSpawnCoords {
    model: string;
    colorData: IColorData;
    textCoords: ItextCoords;
    textColor: IColorRGBA;
    price: number;
}

export interface IVehiclesConfig {
    vehiclesForSale: IVehicleSaleData[];
}
