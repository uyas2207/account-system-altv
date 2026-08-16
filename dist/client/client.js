import * as __WEBPACK_EXTERNAL_MODULE_alt_client_680395b4__ from "alt-client";
import * as __WEBPACK_EXTERNAL_MODULE_natives__ from "natives";
/******/ var __webpack_modules__ = ({

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

const native = __webpack_require__(/*! natives */ "natives"); // вместо import * as native from 'natives'; что бы для ts не нужно было добавлять декларацию
function wait(ms) {
    return new Promise(resolve => alt_client__WEBPACK_IMPORTED_MODULE_0__.setTimeout(resolve, ms));
}
//вызов гташных уведмолени с помощью нативок 
function drawNotification(message, autoHide = false) {
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringPlayerName(message);
    const notificationId = native.endTextCommandThefeedPostTicker(false, false);
    // Таймер для скрытия уведомления через 3 секунды если кроме текста сообщения передали true
    if (autoHide) {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.setTimeout(() => {
            native.thefeedRemoveItem(notificationId);
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
/* harmony import */ var _utilities__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utilities */ "./client/utilities.ts");


let label;
class CarShopClient {
    constructor() {
        this.#init();
    }
    #init() {
        alt_client__WEBPACK_IMPORTED_MODULE_0__.on('consoleCommand', async (command, ...arg) => {
            /*     if(command === 'vehinfo'){
                    const entity = alt.Player.local.vehicle as Record<string, any>;
                    for (let key in entity) {
                        try {
                            alt.log(`${key} = ${entity[key]}`);
                        } catch (error) {
                            
                        }
                    }
                } */
            //marker 500 1 2
            if (command === 'marker') {
                const fontSize = arg[0] ? Number(arg[0]) : 10;
                const scale = arg[1] ? Number(arg[1]) : 2;
                const outlineWidth = arg[2] ? Number(arg[2]) : 1;
                if (label && label.valid) {
                    label.destroy();
                }
                label = new alt_client__WEBPACK_IMPORTED_MODULE_0__.TextLabel('Text\nText2', `ChaletLondon`, fontSize, scale, new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(-1648.79, -3139.85, 13.98), new alt_client__WEBPACK_IMPORTED_MODULE_0__.Vector3(0, 0, 0), new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(255, 0, 0, 255), outlineWidth, new alt_client__WEBPACK_IMPORTED_MODULE_0__.RGBA(0, 0, 255, 255), true, 10);
                //(text: string, fontName: string, fontSize: number, scale: number, pos: alt.IVector3, rot: alt.IVector3, color: alt.RGBA, outlineWidth: number, outlineColor: alt.RGBA, useStreaming?: boolean, streamingDistance?: number)
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
            if (vehicle.hasStreamSyncedMeta('CarForSalePrice')) {
                const price = vehicle.getStreamSyncedMeta('CarForSalePrice');
                (0,_utilities__WEBPACK_IMPORTED_MODULE_1__.drawNotification)(`/buy что бы купить машину ${vehicle.model}, Цена: ${price}`); //вынести тест в конфиг
            }
        });
    }
    #allowCarPurchase(price, vehicle) {
    }
}

})();

