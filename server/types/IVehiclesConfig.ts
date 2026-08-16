
export interface IVehicleSpawnCoords {
    x: number;
    y: number;
    z: number;
    rx: number;
    ry: number;
    rz: number;
}

export interface ICustomColor {
    r: number;
    g: number;
    b: number;
    a: number;
}

export interface IColorData {
    customPrimaryColor: ICustomColor;
    customSecondaryColor: ICustomColor;
}

export interface ITextCoords {
    offsetX: number;
    offsetY: number;
    offsetZ: number;
    distance: number;
}

export interface IVehicleSaleData extends IVehicleSpawnCoords {
    model: string;
    colorData: IColorData;
    textCoords: ITextCoords;
    price: number;
}

export interface IVehiclesConfig {
    vehiclesForSale: IVehicleSaleData[];
}
