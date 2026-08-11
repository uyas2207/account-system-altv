import * as __WEBPACK_EXTERNAL_MODULE_alt_client_680395b4__ from "alt-client";
/******/ var __webpack_modules__ = ({

/***/ "alt-client"
/*!*****************************!*\
  !*** external "alt-client" ***!
  \*****************************/
(module) {

module.exports = __WEBPACK_EXTERNAL_MODULE_alt_client_680395b4__;

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

let label;
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

})();

