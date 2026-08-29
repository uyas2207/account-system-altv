//import vehiclesForSale from './config/VehConfig.json' with { type: 'json' };

import { IVehiclesConfig } from '@shared/types/IVehiclesConfig'

export class ConfigManager {
    constructor(
        private readonly config: IVehiclesConfig
    ){
        this.#init();
    }

    #init(){
        console.log("vehiclesForSale", this.config);
        this.#modifyConfigData();
    }

    #modifyConfigData(){

    }
}