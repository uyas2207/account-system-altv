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

class CarShopVisuals {
    //возможно можно использовать что то более простое чем map, но по поиску элементов и их удалению не меняя id по которым будет обращения map подходит больше всего (если в массиве удалить элемент по index остальные индексы съедут а держать пустой элемент в нем что бы индексы не съезжали неправильно)
    priceTextLabels = new Map();
    constructor() {
    }
    createTextLabels(config) {
        config.vehiclesForSale.forEach((e, index) => {
            const text = e.textCoords;
            const tColor = e.textColor;
            const label = new alt_client__WEBPACK_IMPORTED_MODULE_0__.TextLabel(`${e.model}\n${e.price}`, "ChaletLondon", 100, 1, new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(e.x + text.offsetX, e.y + text.offsetY, e.z + text.offsetZ), new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(e.rx, e.ry, e.rz), new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(tColor.r, tColor.g, tColor.b, tColor.a), 2, new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(tColor.r, tColor.g, tColor.b, tColor.a), true, text.distance);
            console.log('label.font', label.font);
            this.priceTextLabels.set(index, label);
        });
    }
    testDell(index) {
        if (this.priceTextLabels.has(index) !== null && this.priceTextLabels.get(index) !== undefined) {
            console.log('До удаления');
            this.print();
            const label = this.priceTextLabels.get(index);
            // !. так как проверка на undefined уже была 
            label.destroy();
            this.priceTextLabels.delete(index);
            console.log('После удаления');
            this.print();
        }
        else {
            alt_client__WEBPACK_IMPORTED_MODULE_0__.logError(`Под значением ${index} нет label`);
        }
    }
    print() {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.log('Весь priceTextLabels');
        this.priceTextLabels.forEach((value, key) => {
            alt_client__WEBPACK_IMPORTED_MODULE_0__.log(`Ключ: ${(key)}`);
            alt_client__WEBPACK_IMPORTED_MODULE_0__.log('value:', (value));
        });
    }
}


/***/ },

/***/ "./client/utilities.ts"
/*!*****************************!*\
  !*** ./client/utilities.ts ***!
  \*****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawNotification: () => (/* binding */ drawNotification),
/* harmony export */   wait: () => (/* binding */ wait)
/* harmony export */ });
/* harmony import */ var alt_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alt-client */ "alt-client");
/* harmony import */ var natives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! natives */ "natives");


//const native = require('natives'); // вместо import * as native from 'natives'; что бы для ts не нужно было добавлять декларацию
function wait(ms) {
    return new Promise(resolve => alt_client__WEBPACK_IMPORTED_MODULE_0__.setTimeout(resolve, ms));
}
//вызов гташных уведмолени с помощью нативок 
function drawNotification(message, autoHide = false) {
    natives__WEBPACK_IMPORTED_MODULE_1__["default"].beginTextCommandThefeedPost('STRING');
    natives__WEBPACK_IMPORTED_MODULE_1__["default"].addTextComponentSubstringPlayerName(message);
    const notificationId = natives__WEBPACK_IMPORTED_MODULE_1__["default"].endTextCommandThefeedPostTicker(false, false);
    // Таймер для скрытия уведомления через 3 секунды если кроме текста сообщения передали true
    if (autoHide) {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.setTimeout(() => {
            natives__WEBPACK_IMPORTED_MODULE_1__["default"].thefeedRemoveItem(notificationId);
        }, 3000);
    }
}


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
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utilities */ "./client/utilities.ts");
/* harmony import */ var _CarShopVisuals__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CarShopVisuals */ "./client/CarShopVisuals.ts");



let label;

class CarShopClient {
    carShopVisuals;
    constructor() {
        this.#init();
        this.carShopVisuals = new _CarShopVisuals__WEBPACK_IMPORTED_MODULE_3__.CarShopVisuals();
    }
    #init() {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on('consoleCommand', async (command, ...arg) => {
            if (command === 'del') {
                this.carShopVisuals.testDell(Number(arg[0]));
            }
            if (command === 'vehinfo') {
                const entity = alt_client__WEBPACK_IMPORTED_MODULE_0__.Player.local.vehicle;
                for (let key in entity) {
                    try {
                        alt_client__WEBPACK_IMPORTED_MODULE_0__.log(`${key} = ${entity[key]}`);
                    }
                    catch (error) {
                    }
                }
            }
            //marker 500 1 2
            if (command === 'marker') {
                const fontSize = arg[0] ? Number(arg[0]) : 10;
                const scale = arg[1] ? Number(arg[1]) : 2;
                const outlineWidth = arg[2] ? Number(arg[2]) : 1;
                if (label && label.valid) {
                    label.destroy();
                }
                label = new alt_client__WEBPACK_IMPORTED_MODULE_0__.TextLabel('Text\nText2', `ChaletLondon`, fontSize, scale, new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1648.79, -3139.85, 13.98), new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 0), new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(255, 0, 0, 255), outlineWidth, new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(0, 0, 255, 255), true, 10);
                //(text: string, fontName: string, fontSize: number, scale: number, pos: alt.IVector3, rot: alt.IVector3, tColor: alt.RGBA, outlineWidth: number, outlinetColor: alt.RGBA, useStreaming?: boolean, streamingDistance?: number)
            }
            if (command === 'destroy') {
                label.destroy();
                label = null;
            }
            if (command === 'font') {
                console.log('label.font', label.font);
            }
        });
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on('startEnteringVehicle', (vehicle, seat, player) => {
            console.log("vehicle.id", vehicle.id);
            const model = natives__WEBPACK_IMPORTED_MODULE_1__["default"].getDisplayNameFromVehicleModel(vehicle.model);
            console.log('model', model);
            if (vehicle.hasStreamSyncedMeta('CarForSaleId')) {
                (0,_utilities__WEBPACK_IMPORTED_MODULE_2__.drawNotification)(`/buy что бы купить машину ${vehicle.model}`); //вынести текст в конфиг
            }
        });
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on('streamSyncedMetaChange', (entity, metaKey, value, oldValue) => {
            if (metaKey === 'CarForSaleId' && value === undefined) {
                this.carShopVisuals.testDell(oldValue);
            }
        });
        alt_client__WEBPACK_IMPORTED_MODULE_0__.onServer('carShop:createClientDemonstrationScene', (vehiclesForSale) => {
            this.carShopVisuals.createTextLabels(vehiclesForSale);
            //this.#createDemonstrationScene(vehiclesForSale);
        });
    }
    #createDemonstrationScene(config) {
        /*         for (let index = 0; index < config.vehiclesForSale.length; index++) {
                    const e = config.vehiclesForSale[index];
                    const text = e.textCoords;
                    const tColor = e.textColor;
                    new alt.TextLabel(
                        `${e.model}\n${e.price}`,
                        `ChaletLondon`,
                        100,
                        1,
                        new alt.Vector3(
                            e.x + text.offsetX,
                            e.y + text.offsetY,
                            e.z + text.offsetZ
                        ),
                        new alt.Vector3( e.rx, e.ry, e.rz),
                        new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                        2,
                        new alt.RGBA(tColor.r, tColor.g, tColor.b, tColor.a),
                        true,
                        text.distance
                    );
                } */
        config.vehiclesForSale.forEach((e, index) => {
            const text = e.textCoords;
            const tColor = e.textColor;
            new alt_client__WEBPACK_IMPORTED_MODULE_0__.TextLabel(`${e.model}\n${e.price}`, `ChaletLondon`, 100, 1, new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(e.x + text.offsetX, e.y + text.offsetY, e.z + text.offsetZ), new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(e.rx, e.ry, e.rz), new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(tColor.r, tColor.g, tColor.b, tColor.a), 2, new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(tColor.r, tColor.g, tColor.b, tColor.a), true, text.distance);
        });
    }
    #allowCarPurchase(price, vehicle) {
    }
}
new CarShopClient();

})();

