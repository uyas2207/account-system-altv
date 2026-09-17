import * as __WEBPACK_EXTERNAL_MODULE_alt_client_680395b4__ from "alt-client";
import * as __WEBPACK_EXTERNAL_MODULE_natives__ from "natives";
/******/ var __webpack_modules__ = ({

/***/ "./client/CarShopVisuals.ts"
/*!**********************************!*\
  !*** ./client/CarShopVisuals.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CarShopVisuals: () => (/* binding */ CarShopVisuals)
/* harmony export */ });
/* harmony import */ var alt_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt-client */ "alt-client");
/* harmony import */ var _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ConfigClient/ConfigClient */ "./client/ConfigClient/ConfigClient.ts");


class CarShopVisuals {
    //возможно можно использовать что то более простое чем map, но по поиску элементов и их удалению не меняя id по которым будет обращения map подходит больше всего (если в массиве удалить элемент по index остальные индексы съедут а держать пустой элемент в нем что бы индексы не съезжали неправильно)
    priceTextLabels = new Map();
    createTextLabel(coords, e, rotation, index) {
        const label = new alt_client__WEBPACK_IMPORTED_MODULE_0__.TextLabel(`${e.model}\n${e.price}`, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.fontName, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.fontSize, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.scale, coords, rotation, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.color, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.outlineWidth, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.outlineColor, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.useStreaming, _ConfigClient_ConfigClient__WEBPACK_IMPORTED_MODULE_1__.visualTextLabelConfig.streamingDistance);
        this.priceTextLabels.set(index, label);
    }
    destroyLabel(index) {
        if (this.priceTextLabels.has(index)) {
            const label = this.priceTextLabels.get(index);
            label?.destroy();
            this.priceTextLabels.delete(index);
        }
    }
    //дебаг команда потом удалить
    print() {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.log('Весь priceTextLabels');
        this.priceTextLabels.forEach((value, key) => {
            alt_client__WEBPACK_IMPORTED_MODULE_0__.log(`Ключ: ${(key)}`);
            alt_client__WEBPACK_IMPORTED_MODULE_0__.log('value:', (value));
        });
    }
}


/***/ },

/***/ "./client/ConfigClient/ConfigClient.ts"
/*!*********************************************!*\
  !*** ./client/ConfigClient/ConfigClient.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   visualTextLabelConfig: () => (/* binding */ visualTextLabelConfig)
/* harmony export */ });
/* harmony import */ var alt_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt-client */ "alt-client");

const visualTextLabelConfig = {
    fontName: "default",
    fontSize: 100,
    scale: 1,
    color: new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA.white),
    outlineWidth: 2,
    outlineColor: new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA.black),
    useStreaming: true,
    streamingDistance: 100
};


/***/ },

/***/ "./client/utilitiesClient.ts"
/*!***********************************!*\
  !*** ./client/utilitiesClient.ts ***!
  \***********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawNotification: () => (/* binding */ drawNotification)
/* harmony export */ });
/* harmony import */ var alt_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt-client */ "alt-client");
/* harmony import */ var natives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! natives */ "natives");


//вызов гташных уведмолени с помощью нативок 
function drawNotification(message, autoHide = true) {
    natives__WEBPACK_IMPORTED_MODULE_1__["default"].beginTextCommandThefeedPost('STRING');
    natives__WEBPACK_IMPORTED_MODULE_1__["default"].addTextComponentSubstringPlayerName(message);
    const notificationId = natives__WEBPACK_IMPORTED_MODULE_1__["default"].endTextCommandThefeedPostTicker(false, false);
    // Таймер для скрытия уведомления через 3 секунды
    if (autoHide) {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.setTimeout(() => {
            natives__WEBPACK_IMPORTED_MODULE_1__["default"].thefeedRemoveItem(notificationId);
        }, 3000);
    }
}


/***/ },

/***/ "./shared/SharedConfig.ts"
/*!********************************!*\
  !*** ./shared/SharedConfig.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   vehiclesForSaleList: () => (/* binding */ vehiclesForSaleList)
/* harmony export */ });
const vehiclesForSaleList = [
    {
        model: "asd",
        primaryColor: 200,
        secondaryColor: 200,
        price: 1500
    },
    {
        model: "benson",
        primaryColor: 1,
        secondaryColor: 22,
        price: 333
    },
    {
        model: "avisa",
        primaryColor: 61,
        secondaryColor: 24,
        price: 123
    },
    {
        model: "tornado",
        primaryColor: 11,
        secondaryColor: 42,
        price: 4321
    },
    {
        model: "thruster",
        primaryColor: 11,
        secondaryColor: 42,
        price: 4321
    },
    {
        model: "mule",
        primaryColor: 66,
        secondaryColor: 42,
        price: 531
    },
    {
        model: "tornado",
        primaryColor: 11,
        secondaryColor: 42,
        price: 4321
    }
];


/***/ },

/***/ "alt-client"
/*!*****************************!*\
  !*** external "alt-client" ***!
  \*****************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE_alt_client_680395b4__;

/***/ },

/***/ "natives"
/*!**************************!*\
  !*** external "natives" ***!
  \**************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE_natives__;

/***/ }

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ const __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	const cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	const module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	if (!(moduleId in __webpack_modules__)) {
/******/ 		delete __webpack_module_cache__[moduleId];
/******/ 		const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 		e.code = 'MODULE_NOT_FOUND';
/******/ 		throw e;
/******/ 	}
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/define property getters */
/******/ (() => {
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		if(Array.isArray(definition)) {
/******/ 			var i = 0;
/******/ 			while(i < definition.length) {
/******/ 				var key = definition[i++];
/******/ 				var binding = definition[i++];
/******/ 				if(!__webpack_require__.o(exports, key)) {
/******/ 					if(binding === 0) {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, value: definition[i++] });
/******/ 					} else {
/******/ 						Object.defineProperty(exports, key, { enumerable: true, get: binding });
/******/ 					}
/******/ 				} else if(binding === 0) { i++; }
/******/ 			}
/******/ 		} else {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	};
/******/ })();
/******/ 
/******/ /* webpack/runtime/hasOwnProperty shorthand */
/******/ (() => {
/******/ 	__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ })();
/******/ 
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!*******************************!*\
  !*** ./client/startClient.ts ***!
  \*******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alt_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt-client */ "alt-client");
/* harmony import */ var natives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! natives */ "natives");
/* harmony import */ var _utilitiesClient__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilitiesClient */ "./client/utilitiesClient.ts");
/* harmony import */ var _shared_SharedConfig__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @shared/SharedConfig */ "./shared/SharedConfig.ts");
/* harmony import */ var _CarShopVisuals__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CarShopVisuals */ "./client/CarShopVisuals.ts");





class CarShopClient {
    carShopVisuals;
    constructor() {
        this.carShopVisuals = new _CarShopVisuals__WEBPACK_IMPORTED_MODULE_4__.CarShopVisuals();
        this._init();
    }
    _init() {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on("gameEntityCreate", async (entity) => {
            if (entity.type !== alt_client__WEBPACK_IMPORTED_MODULE_0__.BaseObjectType.Vehicle)
                return;
            if (entity.hasStreamSyncedMeta('CarForSaleId')) {
                this._setupCarForSale(entity);
            }
        });
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on("gameEntityDestroy", async (entity) => {
            if (entity.hasStreamSyncedMeta('CarForSaleId')) {
                const index = entity.getStreamSyncedMeta('CarForSaleId');
                this.carShopVisuals.destroyLabel(index);
            }
        });
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on('startEnteringVehicle', (vehicle, seat, player) => {
            if (vehicle.hasStreamSyncedMeta('CarForSaleId')) {
                const model = natives__WEBPACK_IMPORTED_MODULE_1__["default"].getDisplayNameFromVehicleModel(vehicle.model);
                (0,_utilitiesClient__WEBPACK_IMPORTED_MODULE_2__.drawNotification)(`/buy что бы купить машину ${model?.toLowerCase()}`);
            }
        });
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on('streamSyncedMetaChange', (entity, metaKey, value, oldValue) => {
            if (entity.type !== alt_client__WEBPACK_IMPORTED_MODULE_0__.BaseObjectType.Vehicle)
                return;
            if (metaKey === 'CarForSaleId' && value === undefined) {
                this._toogleVehicleAvailability(entity, true);
                this.carShopVisuals.destroyLabel(oldValue);
            }
        });
    }
    async _setupCarForSale(entity) {
        //пока что костыль, почему то при тп в зону с авто их коордлинаты считаются 0, хотя все проверки на valid isspawned visible scriptID и т.д. говорят что авто заспанилось корректно
        //почему то все проверки говорят что авто норм, но координаты неправильны, поэтому добавил задержку перед спавном текста что бы он был на корректных координатах
        if (entity.pos.x === 0) {
            await new Promise(resolve => alt_client__WEBPACK_IMPORTED_MODULE_0__.setTimeout(resolve, 800));
        }
        this._toogleVehicleAvailability(entity, false);
        const coords = this._calculateVehicleTextCoords(entity);
        const index = entity.getStreamSyncedMeta('CarForSaleId');
        const configData = _shared_SharedConfig__WEBPACK_IMPORTED_MODULE_3__.vehiclesForSaleList[index];
        if (!configData) {
            alt_client__WEBPACK_IMPORTED_MODULE_0__.logError(`Не удалось найти машину в конфиге`);
            return;
        }
        this.carShopVisuals.createTextLabel(coords, configData, entity.rot, index);
    }
    _toogleVehicleAvailability(entity, vehicleAvailabilityState) {
        natives__WEBPACK_IMPORTED_MODULE_1__["default"].freezeEntityPosition(entity.scriptID, !vehicleAvailabilityState);
        natives__WEBPACK_IMPORTED_MODULE_1__["default"].setVehicleUndriveable(entity.scriptID, !vehicleAvailabilityState);
        natives__WEBPACK_IMPORTED_MODULE_1__["default"].setEntityCanBeDamaged(entity.scriptID, vehicleAvailabilityState);
    }
    _calculateVehicleTextCoords(entity) {
        const nativeResult = natives__WEBPACK_IMPORTED_MODULE_1__["default"].getModelDimensions(entity.model);
        //длинна от центра машины до ее передней точки по y (независимо от угла под каким стоит машина, вычисления идут по модели в дефолт расположении по осям)
        const length = nativeResult[2].y;
        const expectedX = entity.pos.x - Math.sin(entity.rot.z) * length;
        const expectedY = entity.pos.y + Math.cos(entity.rot.z) * length;
        const expectedZ = entity.pos.z + 0.5;
        return new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(expectedX, expectedY, expectedZ);
    }
    //если потом придется перейти на поиск машины в конфиге а не использование index из StreamSyncedMeta
    _findVehPriceInConfig(model) {
        for (let index = 0; index < _shared_SharedConfig__WEBPACK_IMPORTED_MODULE_3__.vehiclesForSaleList.length; index++) {
            const element = _shared_SharedConfig__WEBPACK_IMPORTED_MODULE_3__.vehiclesForSaleList[index];
            if (element?.model.toLowerCase() === model.toLowerCase()) {
                return { element, index };
            }
        }
    }
}
new CarShopClient();

})();

