/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/find-git-repositories/build/Release/findGitRepos.node":
/*!****************************************************************************!*\
  !*** ./node_modules/find-git-repositories/build/Release/findGitRepos.node ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);

try {
  process.dlopen(module, __dirname + (__webpack_require__(/*! path */ "path").sep) + __webpack_require__.p + "native/findGitRepos.node");
} catch (error) {
  throw new Error('node-loader:\n' + error);
}


/***/ }),

/***/ "./node_modules/@theia/git/lib/node/git-locator/git-locator-host.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@theia/git/lib/node/git-locator/git-locator-host.js ***!
  \**************************************************************************/
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
const core_1 = __webpack_require__(/*! @theia/core */ "./node_modules/@theia/core/lib/common/index.js");
const git_locator_impl_1 = __webpack_require__(/*! ./git-locator-impl */ "./node_modules/@theia/git/lib/node/git-locator/git-locator-impl.js");
exports["default"] = (connection => new core_1.RpcProxyFactory(new git_locator_impl_1.GitLocatorImpl()).listen(connection));


/***/ }),

/***/ "./node_modules/@theia/git/lib/node/git-locator/git-locator-impl.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@theia/git/lib/node/git-locator/git-locator-impl.js ***!
  \**************************************************************************/
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
exports.GitLocatorImpl = void 0;
const fs = __webpack_require__(/*! @theia/core/shared/fs-extra */ "./node_modules/@theia/core/shared/fs-extra/index.js");
const path = __webpack_require__(/*! path */ "path");
const findGitRepositories = __webpack_require__(/*! find-git-repositories */ "./node_modules/find-git-repositories/dist/index.js");
class GitLocatorImpl {
    constructor(options) {
        this.options = {
            info: (message, ...args) => console.info(message, ...args),
            error: (message, ...args) => console.error(message, ...args),
            ...options
        };
    }
    dispose() {
    }
    async locate(basePath, options) {
        return this.doLocate(basePath, {
            maxCount: typeof options.maxCount === 'number' ? options.maxCount : -1,
            visited: new Map()
        });
    }
    async doLocate(basePath, context) {
        const realBasePath = await fs.realpath(basePath);
        if (context.visited.has(realBasePath)) {
            return [];
        }
        context.visited.set(realBasePath, true);
        try {
            const stat = await fs.stat(realBasePath);
            if (!stat.isDirectory()) {
                return [];
            }
            const progress = [];
            const paths = await findGitRepositories(realBasePath, repositories => {
                progress.push(...repositories);
                if (context.maxCount >= 0 && progress.length >= context.maxCount) {
                    return progress.slice(0, context.maxCount).map(GitLocatorImpl.map);
                }
            });
            if (context.maxCount >= 0 && paths.length >= context.maxCount) {
                return await Promise.all(paths.slice(0, context.maxCount).map(GitLocatorImpl.map));
            }
            const repositoryPaths = await Promise.all(paths.map(GitLocatorImpl.map));
            return this.locateFrom(newContext => this.generateNested(repositoryPaths, newContext), context, repositoryPaths);
        }
        catch (e) {
            return [];
        }
    }
    *generateNested(repositoryPaths, context) {
        for (const repository of repositoryPaths) {
            yield this.locateNested(repository, context);
        }
    }
    locateNested(repositoryPath, context) {
        return new Promise(resolve => {
            fs.readdir(repositoryPath, async (err, files) => {
                if (err) {
                    this.options.error(err.message, err);
                    resolve([]);
                }
                else {
                    resolve(this.locateFrom(newContext => this.generateRepositories(repositoryPath, files, newContext), context));
                }
            });
        });
    }
    *generateRepositories(repositoryPath, files, context) {
        for (const file of files) {
            if (file !== '.git') {
                yield this.doLocate(path.join(repositoryPath, file), {
                    ...context
                });
            }
        }
    }
    async locateFrom(generator, parentContext, initial) {
        const result = [];
        if (initial) {
            result.push(...initial);
        }
        const context = {
            ...parentContext,
            maxCount: parentContext.maxCount - result.length
        };
        for (const locateRepositories of generator(context)) {
            const repositories = await locateRepositories;
            result.push(...repositories);
            if (context.maxCount >= 0) {
                if (result.length >= context.maxCount) {
                    return result.slice(0, context.maxCount);
                }
                context.maxCount -= repositories.length;
            }
        }
        return result;
    }
    static async map(repository) {
        return fs.realpath(path.dirname(repository));
    }
}
exports.GitLocatorImpl = GitLocatorImpl;


/***/ }),

/***/ "./node_modules/find-git-repositories/dist/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/find-git-repositories/dist/index.js ***!
  \**********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var _require = __webpack_require__(/*! ../build/Release/findGitRepos.node */ "./node_modules/find-git-repositories/build/Release/findGitRepos.node"),
    findGitRepos = _require.findGitRepos;

var normalizeStartingPath = function normalizeStartingPath(_path) {
  var pathWithNormalizedSlashes = process.platform === 'win32' ? _path.replace(/\\/g, '/') : _path;

  return pathWithNormalizedSlashes.replace(/\/+$/, '');
};

var normalizeRepositoryPath = function normalizeRepositoryPath(_path) {
  return _path.replace(/\//g, '\\');
};

var normalizePathCallback = function normalizePathCallback(callback) {
  return process.platform === 'win32' ? function (paths) {
    return callback(paths.map(normalizeRepositoryPath));
  } : callback;
};

module.exports = function (startingPath, progressCallback) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return new Promise(function (resolve, reject) {
    if (!startingPath && startingPath !== '') {
      reject(new Error('Must provide starting path as first argument.'));
      return;
    }

    var _options$throttleTime = options.throttleTimeoutMS,
        throttleTimeoutMS = _options$throttleTime === undefined ? 0 : _options$throttleTime;


    if (!progressCallback) {
      reject(new Error('Must provide progress callback as second argument.'));
      return;
    }

    try {
      findGitRepos(normalizeStartingPath(startingPath), throttleTimeoutMS, normalizePathCallback(progressCallback), normalizePathCallback(resolve));
    } catch (error) {
      reject(error);
    }
  });
};

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

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("assert");

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
/******/ 	// the startup function
/******/ 	__webpack_require__.x = () => {
/******/ 		// Load entry module and return exports
/******/ 		// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 		var __webpack_exports__ = __webpack_require__.O(undefined, ["vendors-node_modules_theia_core_lib_common_index_js","vendors-node_modules_theia_core_shared_fs-extra_index_js"], () => (__webpack_require__("./node_modules/@theia/git/lib/node/git-locator/git-locator-host.js")))
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
/******/ 			"git-locator-host": 1
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
/******/ 			__webpack_require__.e("vendors-node_modules_theia_core_shared_fs-extra_index_js");
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
//# sourceMappingURL=git-locator-host.js.map