/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@stroncium/procfs/lib/parsers sync recursive ^\\.\\/.*$":
/*!*******************************************************************!*\
  !*** ./node_modules/@stroncium/procfs/lib/parsers/ sync ^\.\/.*$ ***!
  \*******************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./cgroups": "./node_modules/@stroncium/procfs/lib/parsers/cgroups.js",
	"./cgroups.js": "./node_modules/@stroncium/procfs/lib/parsers/cgroups.js",
	"./config": "./node_modules/@stroncium/procfs/lib/parsers/config.js",
	"./config.js": "./node_modules/@stroncium/procfs/lib/parsers/config.js",
	"./cpuinfo": "./node_modules/@stroncium/procfs/lib/parsers/cpuinfo.js",
	"./cpuinfo.js": "./node_modules/@stroncium/procfs/lib/parsers/cpuinfo.js",
	"./devices": "./node_modules/@stroncium/procfs/lib/parsers/devices.js",
	"./devices.js": "./node_modules/@stroncium/procfs/lib/parsers/devices.js",
	"./diskstats": "./node_modules/@stroncium/procfs/lib/parsers/diskstats.js",
	"./diskstats.js": "./node_modules/@stroncium/procfs/lib/parsers/diskstats.js",
	"./filesystems": "./node_modules/@stroncium/procfs/lib/parsers/filesystems.js",
	"./filesystems.js": "./node_modules/@stroncium/procfs/lib/parsers/filesystems.js",
	"./loadavg": "./node_modules/@stroncium/procfs/lib/parsers/loadavg.js",
	"./loadavg.js": "./node_modules/@stroncium/procfs/lib/parsers/loadavg.js",
	"./meminfo": "./node_modules/@stroncium/procfs/lib/parsers/meminfo.js",
	"./meminfo.js": "./node_modules/@stroncium/procfs/lib/parsers/meminfo.js",
	"./partitions": "./node_modules/@stroncium/procfs/lib/parsers/partitions.js",
	"./partitions.js": "./node_modules/@stroncium/procfs/lib/parsers/partitions.js",
	"./processAutogroup": "./node_modules/@stroncium/procfs/lib/parsers/processAutogroup.js",
	"./processAutogroup.js": "./node_modules/@stroncium/procfs/lib/parsers/processAutogroup.js",
	"./processCgroups": "./node_modules/@stroncium/procfs/lib/parsers/processCgroups.js",
	"./processCgroups.js": "./node_modules/@stroncium/procfs/lib/parsers/processCgroups.js",
	"./processCmdline": "./node_modules/@stroncium/procfs/lib/parsers/processCmdline.js",
	"./processCmdline.js": "./node_modules/@stroncium/procfs/lib/parsers/processCmdline.js",
	"./processEnviron": "./node_modules/@stroncium/procfs/lib/parsers/processEnviron.js",
	"./processEnviron.js": "./node_modules/@stroncium/procfs/lib/parsers/processEnviron.js",
	"./processExe": "./node_modules/@stroncium/procfs/lib/parsers/processExe.js",
	"./processExe.js": "./node_modules/@stroncium/procfs/lib/parsers/processExe.js",
	"./processFd": "./node_modules/@stroncium/procfs/lib/parsers/processFd.js",
	"./processFd.js": "./node_modules/@stroncium/procfs/lib/parsers/processFd.js",
	"./processFdinfo": "./node_modules/@stroncium/procfs/lib/parsers/processFdinfo.js",
	"./processFdinfo.js": "./node_modules/@stroncium/procfs/lib/parsers/processFdinfo.js",
	"./processFds": "./node_modules/@stroncium/procfs/lib/parsers/processFds.js",
	"./processFds.js": "./node_modules/@stroncium/procfs/lib/parsers/processFds.js",
	"./processGidMap": "./node_modules/@stroncium/procfs/lib/parsers/processGidMap.js",
	"./processGidMap.js": "./node_modules/@stroncium/procfs/lib/parsers/processGidMap.js",
	"./processIo": "./node_modules/@stroncium/procfs/lib/parsers/processIo.js",
	"./processIo.js": "./node_modules/@stroncium/procfs/lib/parsers/processIo.js",
	"./processLimits": "./node_modules/@stroncium/procfs/lib/parsers/processLimits.js",
	"./processLimits.js": "./node_modules/@stroncium/procfs/lib/parsers/processLimits.js",
	"./processMountinfo": "./node_modules/@stroncium/procfs/lib/parsers/processMountinfo.js",
	"./processMountinfo.js": "./node_modules/@stroncium/procfs/lib/parsers/processMountinfo.js",
	"./processNetDev": "./node_modules/@stroncium/procfs/lib/parsers/processNetDev.js",
	"./processNetDev.js": "./node_modules/@stroncium/procfs/lib/parsers/processNetDev.js",
	"./processNetTcp4": "./node_modules/@stroncium/procfs/lib/parsers/processNetTcp4.js",
	"./processNetTcp4.js": "./node_modules/@stroncium/procfs/lib/parsers/processNetTcp4.js",
	"./processNetTcp6": "./node_modules/@stroncium/procfs/lib/parsers/processNetTcp6.js",
	"./processNetTcp6.js": "./node_modules/@stroncium/procfs/lib/parsers/processNetTcp6.js",
	"./processNetUdp4": "./node_modules/@stroncium/procfs/lib/parsers/processNetUdp4.js",
	"./processNetUdp4.js": "./node_modules/@stroncium/procfs/lib/parsers/processNetUdp4.js",
	"./processNetUdp6": "./node_modules/@stroncium/procfs/lib/parsers/processNetUdp6.js",
	"./processNetUdp6.js": "./node_modules/@stroncium/procfs/lib/parsers/processNetUdp6.js",
	"./processNetUnix": "./node_modules/@stroncium/procfs/lib/parsers/processNetUnix.js",
	"./processNetUnix.js": "./node_modules/@stroncium/procfs/lib/parsers/processNetUnix.js",
	"./processNetWireless": "./node_modules/@stroncium/procfs/lib/parsers/processNetWireless.js",
	"./processNetWireless.js": "./node_modules/@stroncium/procfs/lib/parsers/processNetWireless.js",
	"./processStat": "./node_modules/@stroncium/procfs/lib/parsers/processStat.js",
	"./processStat.js": "./node_modules/@stroncium/procfs/lib/parsers/processStat.js",
	"./processStatm": "./node_modules/@stroncium/procfs/lib/parsers/processStatm.js",
	"./processStatm.js": "./node_modules/@stroncium/procfs/lib/parsers/processStatm.js",
	"./processStatus": "./node_modules/@stroncium/procfs/lib/parsers/processStatus.js",
	"./processStatus.js": "./node_modules/@stroncium/procfs/lib/parsers/processStatus.js",
	"./processThreads": "./node_modules/@stroncium/procfs/lib/parsers/processThreads.js",
	"./processThreads.js": "./node_modules/@stroncium/procfs/lib/parsers/processThreads.js",
	"./processUidMap": "./node_modules/@stroncium/procfs/lib/parsers/processUidMap.js",
	"./processUidMap.js": "./node_modules/@stroncium/procfs/lib/parsers/processUidMap.js",
	"./processes": "./node_modules/@stroncium/procfs/lib/parsers/processes.js",
	"./processes.js": "./node_modules/@stroncium/procfs/lib/parsers/processes.js",
	"./stat": "./node_modules/@stroncium/procfs/lib/parsers/stat.js",
	"./stat.js": "./node_modules/@stroncium/procfs/lib/parsers/stat.js",
	"./swaps": "./node_modules/@stroncium/procfs/lib/parsers/swaps.js",
	"./swaps.js": "./node_modules/@stroncium/procfs/lib/parsers/swaps.js",
	"./uptime": "./node_modules/@stroncium/procfs/lib/parsers/uptime.js",
	"./uptime.js": "./node_modules/@stroncium/procfs/lib/parsers/uptime.js",
	"./utils": "./node_modules/@stroncium/procfs/lib/parsers/utils.js",
	"./utils.js": "./node_modules/@stroncium/procfs/lib/parsers/utils.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./node_modules/@stroncium/procfs/lib/parsers sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./node_modules/express/lib sync recursive":
/*!****************************************!*\
  !*** ./node_modules/express/lib/ sync ***!
  \****************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/express/lib sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./node_modules/require-main-filename sync recursive":
/*!**************************************************!*\
  !*** ./node_modules/require-main-filename/ sync ***!
  \**************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/require-main-filename sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./lib/backend/native-webpack-plugin/bindings.js":
/*!*******************************************************!*\
  !*** ./lib/backend/native-webpack-plugin/bindings.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = function (jsModule) {
    switch (jsModule) {
        case 'drivelist': return __webpack_require__(/*! drivelist/build/Release/drivelist.node */ "./node_modules/drivelist/build/Release/drivelist.node");
    }
    throw new Error(`unhandled module: "${jsModule}"`);
}

/***/ }),

/***/ "./lib/backend/native-webpack-plugin/ripgrep.js":
/*!******************************************************!*\
  !*** ./lib/backend/native-webpack-plugin/ripgrep.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


const path = __webpack_require__(/*! path */ "path");

exports.rgPath = path.join(__dirname, `./native/rg${process.platform === 'win32' ? '.exe' : ''}`);


/***/ }),

/***/ "./src-gen/backend/main.js":
/*!*********************************!*\
  !*** ./src-gen/backend/main.js ***!
  \*********************************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

// @ts-check
const { BackendApplicationConfigProvider } = __webpack_require__(/*! @theia/core/lib/node/backend-application-config-provider */ "./node_modules/@theia/core/lib/node/backend-application-config-provider.js");
const main = __webpack_require__(/*! @theia/core/lib/node/main */ "./node_modules/@theia/core/lib/node/main.js");

BackendApplicationConfigProvider.set({
    "singleInstance": false
});

const serverModule = __webpack_require__(/*! ./server */ "./src-gen/backend/server.js");
const serverAddress = main.start(serverModule());

serverAddress.then(({ port, address, family }) => {
    if (process && process.send) {
        process.send({ port, address, family });
    }
});

globalThis.serverAddress = serverAddress;


/***/ }),

/***/ "./src-gen/backend/server.js":
/*!***********************************!*\
  !*** ./src-gen/backend/server.js ***!
  \***********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// @ts-check
__webpack_require__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");

// Erase the ELECTRON_RUN_AS_NODE variable from the environment, else Electron apps started using Theia will pick it up.
if ('ELECTRON_RUN_AS_NODE' in process.env) {
    delete process.env.ELECTRON_RUN_AS_NODE;
}

const path = __webpack_require__(/*! path */ "path");
const express = __webpack_require__(/*! express */ "./node_modules/express/index.js");
const { Container } = __webpack_require__(/*! inversify */ "./node_modules/inversify/es/inversify.js");
const { BackendApplication, BackendApplicationServer, CliManager } = __webpack_require__(/*! @theia/core/lib/node */ "./node_modules/@theia/core/lib/node/index.js");
const { backendApplicationModule } = __webpack_require__(/*! @theia/core/lib/node/backend-application-module */ "./node_modules/@theia/core/lib/node/backend-application-module.js");
const { messagingBackendModule } = __webpack_require__(/*! @theia/core/lib/node/messaging/messaging-backend-module */ "./node_modules/@theia/core/lib/node/messaging/messaging-backend-module.js");
const { loggerBackendModule } = __webpack_require__(/*! @theia/core/lib/node/logger-backend-module */ "./node_modules/@theia/core/lib/node/logger-backend-module.js");

const container = new Container();
container.load(backendApplicationModule);
container.load(messagingBackendModule);
container.load(loggerBackendModule);

function defaultServeStatic(app) {
    app.use(express.static(path.resolve(__dirname, '../../lib/frontend')))
}

function load(raw) {
    return Promise.resolve(raw).then(
        module => container.load(module.default)
    );
}

async function start(port, host, argv = process.argv) {
    if (!container.isBound(BackendApplicationServer)) {
        container.bind(BackendApplicationServer).toConstantValue({ configure: defaultServeStatic });
    }
    await container.get(CliManager).initializeCli(argv);
    return container.get(BackendApplication).start(port, host);
}

module.exports = async (port, host, argv) => {
    try {
        await load(__webpack_require__(/*! @theia/core/lib/node/i18n/i18n-backend-module */ "./node_modules/@theia/core/lib/node/i18n/i18n-backend-module.js"));
        await load(__webpack_require__(/*! @theia/core/lib/node/hosting/backend-hosting-module */ "./node_modules/@theia/core/lib/node/hosting/backend-hosting-module.js"));
        await load(__webpack_require__(/*! @theia/core/lib/node/request/backend-request-module */ "./node_modules/@theia/core/lib/node/request/backend-request-module.js"));
        await load(__webpack_require__(/*! @theia/filesystem/lib/node/filesystem-backend-module */ "./node_modules/@theia/filesystem/lib/node/filesystem-backend-module.js"));
        await load(__webpack_require__(/*! @theia/filesystem/lib/node/download/file-download-backend-module */ "./node_modules/@theia/filesystem/lib/node/download/file-download-backend-module.js"));
        await load(__webpack_require__(/*! @theia/process/lib/common/process-common-module */ "./node_modules/@theia/process/lib/common/process-common-module.js"));
        await load(__webpack_require__(/*! @theia/process/lib/node/process-backend-module */ "./node_modules/@theia/process/lib/node/process-backend-module.js"));
        await load(__webpack_require__(/*! @theia/workspace/lib/node/workspace-backend-module */ "./node_modules/@theia/workspace/lib/node/workspace-backend-module.js"));
        await load(__webpack_require__(/*! @theia/file-search/lib/node/file-search-backend-module */ "./node_modules/@theia/file-search/lib/node/file-search-backend-module.js"));
        await load(__webpack_require__(/*! @theia/git/lib/node/git-backend-module */ "./node_modules/@theia/git/lib/node/git-backend-module.js"));
        await load(__webpack_require__(/*! @theia/git/lib/node/env/git-env-module */ "./node_modules/@theia/git/lib/node/env/git-env-module.js"));
        await load(__webpack_require__(/*! @theia/terminal/lib/node/terminal-backend-module */ "./node_modules/@theia/terminal/lib/node/terminal-backend-module.js"));
        await load(__webpack_require__(/*! @theia/task/lib/node/task-backend-module */ "./node_modules/@theia/task/lib/node/task-backend-module.js"));
        await load(__webpack_require__(/*! @theia/debug/lib/node/debug-backend-module */ "./node_modules/@theia/debug/lib/node/debug-backend-module.js"));
        await load(__webpack_require__(/*! @theia/search-in-workspace/lib/node/search-in-workspace-backend-module */ "./node_modules/@theia/search-in-workspace/lib/node/search-in-workspace-backend-module.js"));
        await load(__webpack_require__(/*! @theia/plugin-ext/lib/plugin-ext-backend-module */ "./node_modules/@theia/plugin-ext/lib/plugin-ext-backend-module.js"));
        await load(__webpack_require__(/*! @theia/plugin-ext-vscode/lib/node/plugin-vscode-backend-module */ "./node_modules/@theia/plugin-ext-vscode/lib/node/plugin-vscode-backend-module.js"));
        await load(__webpack_require__(/*! @theia/mini-browser/lib/node/mini-browser-backend-module */ "./node_modules/@theia/mini-browser/lib/node/mini-browser-backend-module.js"));
        await load(__webpack_require__(/*! @theia/vsx-registry/lib/common/vsx-registry-common-module */ "./node_modules/@theia/vsx-registry/lib/common/vsx-registry-common-module.js"));
        await load(__webpack_require__(/*! @theia/vsx-registry/lib/node/vsx-registry-backend-module */ "./node_modules/@theia/vsx-registry/lib/node/vsx-registry-backend-module.js"));
        return await start(port, host, argv);
    } catch (error) {
        console.error('Failed to start the backend application:');
        console.error(error);
        process.exitCode = 1;
        throw error;
    }
}


/***/ }),

/***/ "./node_modules/vscode-languageserver-textdocument/lib/umd sync recursive":
/*!***********************************************************************!*\
  !*** ./node_modules/vscode-languageserver-textdocument/lib/umd/ sync ***!
  \***********************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/vscode-languageserver-textdocument/lib/umd sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./node_modules/vscode-languageserver-types/lib/umd sync recursive":
/*!****************************************************************!*\
  !*** ./node_modules/vscode-languageserver-types/lib/umd/ sync ***!
  \****************************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/vscode-languageserver-types/lib/umd sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./node_modules/yargs-parser sync recursive":
/*!*****************************************!*\
  !*** ./node_modules/yargs-parser/ sync ***!
  \*****************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/yargs-parser sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./node_modules/yargs/build/lib sync recursive":
/*!********************************************!*\
  !*** ./node_modules/yargs/build/lib/ sync ***!
  \********************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/yargs/build/lib sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./node_modules/yargs sync recursive":
/*!**********************************!*\
  !*** ./node_modules/yargs/ sync ***!
  \**********************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/yargs sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ "async_hooks":
/*!******************************!*\
  !*** external "async_hooks" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("child_process");

/***/ }),

/***/ "constants":
/*!****************************!*\
  !*** external "constants" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("constants");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "dns":
/*!**********************!*\
  !*** external "dns" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("dns");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ "fs/promises":
/*!******************************!*\
  !*** external "fs/promises" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("fs/promises");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ "module":
/*!*************************!*\
  !*** external "module" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("module");

/***/ }),

/***/ "net":
/*!**********************!*\
  !*** external "net" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ "perf_hooks":
/*!*****************************!*\
  !*** external "perf_hooks" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("perf_hooks");

/***/ }),

/***/ "pnpapi":
/*!*************************!*\
  !*** external "pnpapi" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("pnpapi");

/***/ }),

/***/ "process":
/*!**************************!*\
  !*** external "process" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("process");

/***/ }),

/***/ "punycode":
/*!***************************!*\
  !*** external "punycode" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("punycode");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),

/***/ "readline":
/*!***************************!*\
  !*** external "readline" ***!
  \***************************/
/***/ ((module) => {

"use strict";
module.exports = require("readline");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "string_decoder":
/*!*********************************!*\
  !*** external "string_decoder" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("string_decoder");

/***/ }),

/***/ "timers":
/*!*************************!*\
  !*** external "timers" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),

/***/ "tls":
/*!**********************!*\
  !*** external "tls" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ "tty":
/*!**********************!*\
  !*** external "tty" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ "worker_threads":
/*!*********************************!*\
  !*** external "worker_threads" ***!
  \*********************************/
/***/ ((module) => {

"use strict";
module.exports = require("worker_threads");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

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
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_theia_core_lib_common_index_js","vendors-node_modules_theia_plugin-ext_lib_common_plugin-api-rpc_js","vendors-node_modules_theia_core_lib_node_file-uri_js-node_modules_yargs_index_js","vendors-node_modules_theia_core_shared_fs-extra_index_js","vendors-node_modules_theia_core_lib_node_messaging_ipc-channel_js-node_modules_theia_core_lib-cf60f3","vendors-node_modules_theia_application-package_lib_api_js-node_modules_theia_plugin-ext_lib_c-08ad78","vendors-node_modules_theia_core_lib_common_collections_js-node_modules_theia_core_lib_common_-2f9963","vendors-node_modules_theia_filesystem_lib_node_nsfw-watcher_nsfw-filesystem-service_js","vendors-node_modules_drivelist_build_Release_drivelist_node-node_modules_stroncium_procfs_lib-e56898"], () => (__webpack_require__("./src-gen/backend/main.js")))
/******/ 		__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 		return __webpack_exports__;
/******/ 	};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks and sibling chunks for the entrypoint
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"main": 1
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.O.require = (chunkId) => (installedChunks[chunkId]);
/******/ 		
/******/ 		var installChunk = (chunk) => {
/******/ 			var moreModules = chunk.modules, chunkIds = chunk.ids, runtime = chunk.runtime;
/******/ 			for(var moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			for(var i = 0; i < chunkIds.length; i++)
/******/ 				installedChunks[chunkIds[i]] = 1;
/******/ 			__webpack_require__.O();
/******/ 		};
/******/ 		
/******/ 		// require() chunk loading for javascript
/******/ 		__webpack_require__.f.require = (chunkId, promises) => {
/******/ 			// "1" is the signal for "already loaded"
/******/ 			if(!installedChunks[chunkId]) {
/******/ 				if(true) { // all chunks have JS
/******/ 					installChunk(require("./" + __webpack_require__.u(chunkId)));
/******/ 				} else installedChunks[chunkId] = 1;
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/startup chunk dependencies */
/******/ 	(() => {
/******/ 		var next = __webpack_require__.x;
/******/ 		__webpack_require__.x = () => {
/******/ 			__webpack_require__.e("vendors-node_modules_theia_core_lib_common_index_js");
/******/ 			__webpack_require__.e("vendors-node_modules_theia_plugin-ext_lib_common_plugin-api-rpc_js");
/******/ 			__webpack_require__.e("vendors-node_modules_theia_core_lib_node_file-uri_js-node_modules_yargs_index_js");
/******/ 			__webpack_require__.e("vendors-node_modules_theia_core_shared_fs-extra_index_js");
/******/ 			__webpack_require__.e("vendors-node_modules_theia_core_lib_node_messaging_ipc-channel_js-node_modules_theia_core_lib-cf60f3");
/******/ 			__webpack_require__.e("vendors-node_modules_theia_application-package_lib_api_js-node_modules_theia_plugin-ext_lib_c-08ad78");
/******/ 			__webpack_require__.e("vendors-node_modules_theia_core_lib_common_collections_js-node_modules_theia_core_lib_common_-2f9963");
/******/ 			__webpack_require__.e("vendors-node_modules_theia_filesystem_lib_node_nsfw-watcher_nsfw-filesystem-service_js");
/******/ 			__webpack_require__.e("vendors-node_modules_drivelist_build_Release_drivelist_node-node_modules_stroncium_procfs_lib-e56898");
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.js.map