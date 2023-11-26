/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@theia/core/lib/node sync recursive":
/*!*************************************************!*\
  !*** ./node_modules/@theia/core/lib/node/ sync ***!
  \*************************************************/
/***/ ((module) => {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = () => ([]);
webpackEmptyContext.resolve = webpackEmptyContext;
webpackEmptyContext.id = "./node_modules/@theia/core/lib/node sync recursive";
module.exports = webpackEmptyContext;

/***/ }),

/***/ "./node_modules/@theia/core/lib/common/message-rpc/uint8-array-message-buffer.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@theia/core/lib/common/message-rpc/uint8-array-message-buffer.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Uint8ArrayReadBuffer = exports.Uint8ArrayWriteBuffer = void 0;
const event_1 = __webpack_require__(/*! ../event */ "./node_modules/@theia/core/lib/common/event.js");
/**
 * The default {@link WriteBuffer} implementation. Uses a {@link Uint8Array} for buffering.
 * The {@link Uint8ArrayWriteBuffer.onCommit} hook can be used to rect to on-commit events.
 * After the {@link Uint8ArrayWriteBuffer.commit} method has been called the buffer is disposed
 * and can no longer be used for writing data. If the writer buffer is no longer needed but the message
 * has not been committed yet it has to be disposed manually.
 */
class Uint8ArrayWriteBuffer {
    constructor(buffer = new Uint8Array(1024), writePosition = 0) {
        this.buffer = buffer;
        this.encoder = new TextEncoder();
        this.isDisposed = false;
        this.onCommitEmitter = new event_1.Emitter();
        this.offset = buffer.byteOffset + writePosition;
        this.msg = new DataView(buffer.buffer);
    }
    ensureCapacity(value) {
        let newLength = this.buffer.byteLength;
        while (newLength < this.offset + value) {
            newLength *= 2;
        }
        if (newLength !== this.buffer.byteLength) {
            const newBuffer = new Uint8Array(newLength);
            newBuffer.set(this.buffer);
            this.buffer = newBuffer;
            this.msg = new DataView(this.buffer.buffer);
        }
        return this;
    }
    writeLength(length) {
        if (length < 0 || (length % 1) !== 0) {
            throw new Error(`Could not write the given length value. '${length}' is not an integer >= 0`);
        }
        if (length < 127) {
            this.writeUint8(length);
        }
        else {
            this.writeUint8(128 + (length & 127));
            this.writeLength(length >> 7);
        }
        return this;
    }
    writeNumber(value) {
        this.ensureCapacity(8);
        this.msg.setFloat64(this.offset, value);
        this.offset += 8;
        return this;
    }
    writeUint8(value) {
        this.ensureCapacity(1);
        this.buffer[this.offset++] = value;
        return this;
    }
    writeUint16(value) {
        this.ensureCapacity(2);
        this.msg.setUint16(this.offset, value);
        this.offset += 2;
        return this;
    }
    writeUint32(value) {
        this.ensureCapacity(4);
        this.msg.setUint32(this.offset, value);
        this.offset += 4;
        return this;
    }
    writeString(value) {
        this.ensureCapacity(4 * value.length);
        const result = this.encoder.encodeInto(value, this.buffer.subarray(this.offset + 4));
        this.msg.setUint32(this.offset, result.written);
        this.offset += 4 + result.written;
        return this;
    }
    writeBytes(value) {
        this.writeLength(value.byteLength);
        this.ensureCapacity(value.length);
        this.buffer.set(value, this.offset);
        this.offset += value.length;
        return this;
    }
    get onCommit() {
        return this.onCommitEmitter.event;
    }
    commit() {
        if (this.isDisposed) {
            throw new Error("Could not invoke 'commit'. The WriteBuffer is already disposed.");
        }
        this.onCommitEmitter.fire(this.getCurrentContents());
        this.dispose();
    }
    getCurrentContents() {
        return this.buffer.slice(this.buffer.byteOffset, this.offset);
    }
    dispose() {
        if (!this.isDisposed) {
            this.onCommitEmitter.dispose();
            this.isDisposed = true;
        }
    }
}
exports.Uint8ArrayWriteBuffer = Uint8ArrayWriteBuffer;
/**
 * The default {@link ReadBuffer} implementation. Uses a {@link Uint8Array} for buffering.
 * Is for single message read. A message can only be read once.
 */
class Uint8ArrayReadBuffer {
    constructor(buffer, readPosition = 0) {
        this.buffer = buffer;
        this.offset = 0;
        this.decoder = new TextDecoder();
        this.offset = buffer.byteOffset + readPosition;
        this.msg = new DataView(buffer.buffer);
    }
    readUint8() {
        return this.msg.getUint8(this.offset++);
    }
    readUint16() {
        const result = this.msg.getUint16(this.offset);
        this.offset += 2;
        return result;
    }
    readUint32() {
        const result = this.msg.getUint32(this.offset);
        this.offset += 4;
        return result;
    }
    readLength() {
        let shift = 0;
        let byte = this.readUint8();
        let value = (byte & 127) << shift;
        while (byte > 127) {
            shift += 7;
            byte = this.readUint8();
            value = value + ((byte & 127) << shift);
        }
        return value;
    }
    readNumber() {
        const result = this.msg.getFloat64(this.offset);
        this.offset += 8;
        return result;
    }
    readString() {
        const len = this.readUint32();
        const sliceOffset = this.offset - this.buffer.byteOffset;
        const result = this.decodeString(this.buffer.slice(sliceOffset, sliceOffset + len));
        this.offset += len;
        return result;
    }
    decodeString(buf) {
        return this.decoder.decode(buf);
    }
    readBytes() {
        const length = this.readLength();
        const sliceOffset = this.offset - this.buffer.byteOffset;
        const result = this.buffer.slice(sliceOffset, sliceOffset + length);
        this.offset += length;
        return result;
    }
    sliceAtReadPosition() {
        const sliceOffset = this.offset - this.buffer.byteOffset;
        return new Uint8ArrayReadBuffer(this.buffer, sliceOffset);
    }
}
exports.Uint8ArrayReadBuffer = Uint8ArrayReadBuffer;


/***/ }),

/***/ "./node_modules/@theia/core/lib/node/dynamic-require.js":
/*!**************************************************************!*\
  !*** ./node_modules/@theia/core/lib/node/dynamic-require.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2021 Ericsson and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.removeFromCache = exports.dynamicRequire = void 0;
const nodeRequire = typeof require !== 'undefined' ? require : __webpack_require__("./node_modules/@theia/core/lib/node sync recursive");
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dynamicRequire(id) {
    if (typeof id !== 'string') {
        throw new TypeError('module id must be a string');
    }
    if (id.startsWith('.')) {
        throw new Error(`module id cannot be a relative path, id: "${id}"`);
    }
    return nodeRequire(id);
}
exports.dynamicRequire = dynamicRequire;
/**
 * Remove all references to a module from Node's module cache.
 * @param filter callback to filter modules from the cache: return `true` to remove the module from the cache.
 */
function removeFromCache(filter) {
    Object.entries(nodeRequire.cache).forEach(([key, mod]) => {
        if (!mod || mod.id.endsWith('.node')) {
            return;
        }
        if (filter(mod)) {
            delete nodeRequire.cache[key];
            delete mod.exports;
            mod.children.length = 0;
            return;
        }
        mod.children.splice(0, mod.children.length, ...mod.children.filter(child => {
            if (filter(child)) {
                delete child.exports;
                child.children.length = 0;
                return false;
            }
            return true;
        }));
    });
}
exports.removeFromCache = removeFromCache;


/***/ }),

/***/ "./node_modules/@theia/core/lib/node/messaging/ipc-bootstrap.js":
/*!**********************************************************************!*\
  !*** ./node_modules/@theia/core/lib/node/messaging/ipc-bootstrap.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// *****************************************************************************
// Copyright (C) 2017 TypeFox and others.
//
// This program and the accompanying materials are made available under the
// terms of the Eclipse Public License v. 2.0 which is available at
// http://www.eclipse.org/legal/epl-2.0.
//
// This Source Code may also be made available under the following Secondary
// Licenses when the conditions for such availability set forth in the Eclipse
// Public License v. 2.0 are satisfied: GNU General Public License, version 2
// with the GNU Classpath Exception which is available at
// https://www.gnu.org/software/classpath/license.html.
//
// SPDX-License-Identifier: EPL-2.0 OR GPL-2.0-only WITH Classpath-exception-2.0
// *****************************************************************************
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! reflect-metadata */ "./node_modules/reflect-metadata/Reflect.js");
const dynamic_require_1 = __webpack_require__(/*! ../dynamic-require */ "./node_modules/@theia/core/lib/node/dynamic-require.js");
const ipc_channel_1 = __webpack_require__(/*! ./ipc-channel */ "./node_modules/@theia/core/lib/node/messaging/ipc-channel.js");
const ipc_protocol_1 = __webpack_require__(/*! ./ipc-protocol */ "./node_modules/@theia/core/lib/node/messaging/ipc-protocol.js");
(0, ipc_protocol_1.checkParentAlive)();
const entryPoint = ipc_protocol_1.IPCEntryPoint.getScriptFromEnv();
(0, dynamic_require_1.dynamicRequire)(entryPoint).default(new ipc_channel_1.IPCChannel());


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

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");

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

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");

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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_theia_core_lib_common_index_js","vendors-node_modules_theia_core_lib_node_messaging_ipc-channel_js-node_modules_theia_core_lib-cf60f3"], () => (__webpack_require__("./node_modules/@theia/core/lib/node/messaging/ipc-bootstrap.js")))
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
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = {
/******/ 			"ipc-bootstrap": 1
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
/******/ 			__webpack_require__.e("vendors-node_modules_theia_core_lib_node_messaging_ipc-channel_js-node_modules_theia_core_lib-cf60f3");
/******/ 			return next();
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// run startup
/******/ 	var __webpack_exports__ = __webpack_require__.x();
/******/ 	
/******/ })()
;
//# sourceMappingURL=ipc-bootstrap.js.map