/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/node-pty/lib/shared/conout.js":
/*!****************************************************!*\
  !*** ./node_modules/node-pty/lib/shared/conout.js ***!
  \****************************************************/
/***/ ((__unused_webpack_module, exports) => {


/**
 * Copyright (c) 2020, Microsoft Corporation (MIT License).
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getWorkerPipeName = void 0;
function getWorkerPipeName(conoutPipeName) {
    return conoutPipeName + "-worker";
}
exports.getWorkerPipeName = getWorkerPipeName;


/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("net");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("worker_threads");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
/*!****************************************************************!*\
  !*** ./node_modules/node-pty/lib/worker/conoutSocketWorker.js ***!
  \****************************************************************/

/**
 * Copyright (c) 2020, Microsoft Corporation (MIT License).
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
var worker_threads_1 = __webpack_require__(/*! worker_threads */ "worker_threads");
var net_1 = __webpack_require__(/*! net */ "net");
var conout_1 = __webpack_require__(/*! ../shared/conout */ "./node_modules/node-pty/lib/shared/conout.js");
var conoutPipeName = worker_threads_1.workerData.conoutPipeName;
var conoutSocket = new net_1.Socket();
conoutSocket.setEncoding('utf8');
conoutSocket.connect(conoutPipeName, function () {
    var server = net_1.createServer(function (workerSocket) {
        conoutSocket.pipe(workerSocket);
    });
    server.listen(conout_1.getWorkerPipeName(conoutPipeName));
    worker_threads_1.parentPort.postMessage(1 /* READY */);
});

})();

/******/ })()
;
//# sourceMappingURL=conoutSocketWorker.js.map